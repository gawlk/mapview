import { store } from '/src/store'

export const createLine = (
  reportSettings: Accessor<BaseReportSettings>,
  projectSettings: Accessor<BaseProjectSettings>,
  points: Accessor<BasePoint[]>,
  map: mapboxgl.Map | null,
): Line => {
  const id = `line-${+new Date()}${Math.random()}`

  const activePoints = createMemo(() =>
    points().filter((point) => point.settings.isVisible()),
  )

  const features = createMemo<
    GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[]
  >(() =>
    activePoints()
      .slice(1)
      .map((point, index) => ({
        type: 'Feature',
        properties: {
          color: activePoints()[index].icon?.color() || 'gray',
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [
              activePoints()[index].coordinates()?.lng || 0,
              activePoints()[index].coordinates()?.lat || 0,
            ],
            [point.coordinates()?.lng || 0, point.coordinates()?.lat || 0],
          ],
        },
      })),
  )

  const addLayerToMap = () => {
    if (map?.getLayer(id)) return

    map?.addLayer(
      {
        id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 6,
        },
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: features(),
          },
        } as unknown as mapboxgl.GeoJSONSource,
        type: 'line',
      },
      'lines',
    )
  }

  const shouldBeOnMap = createMemo(
    () =>
      reportSettings().isVisible() &&
      projectSettings().arePointsLinked() &&
      store.selectedProject()?.settings === projectSettings(),
  )

  createEffect(() => {
    if (map) {
      if (shouldBeOnMap()) {
        addLayerToMap()
      } else {
        map.getLayer(id) && map.removeLayer(id)
        map.getSource(id) && map.removeSource(id)
      }
    }
  })

  const line: Line = {
    refresh() {
      if (shouldBeOnMap()) {
        addLayerToMap()
      }
    },
  }

  createEffect(() => {
    const _features = features()

    const source = map?.getSource(id) as mapboxgl.GeoJSONSource | undefined

    source?.setData({
      type: 'FeatureCollection',
      features: _features,
    })
  })

  return line
}

export const sortPoints = <Points extends BasePoint[] = BasePoint[]>(
  points: Points,
) => points.sort((pointA, pointB) => pointA.index() - pointB.index())
