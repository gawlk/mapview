import { createWatcherHandler } from '/src/scripts'

export const createLine = (points: MachinePoint[], map: mapboxgl.Map): Line => {
  const id = `line-${+new Date()}${Math.random()}`
  let features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] =
    []

  const watcherHandler = createWatcherHandler()

  const line: Line = {
    addToMap: (): void => {
      map.addLayer(
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
              features: [],
            },
          } as unknown as mapboxgl.GeoJSONSource,
          type: 'line',
        },
        'lines'
      )

      watcherHandler.add(
        watch(
          points,
          () => {
            line.update()

            points.forEach((point) => {
              point.marker.on('drag', () => {
                line.update()
              })
            })
          },
          {
            immediate: true,
          }
        )
      )
    },
    remove: (): void => {
      map.getLayer(id) && map.removeLayer(id)
      map.getSource(id) && map.removeSource(id)

      watcherHandler.clean()
    },
    update: (): void => {
      const visiblePoints = points.filter(
        (point) =>
          point.settings.isVisible && (!point.zone || point.zone.isVisible)
      )

      features = []

      for (let i = 1; i < visiblePoints.length; i++) {
        features.push({
          type: 'Feature',
          properties: {
            color: visiblePoints[i - 1].icon.color,
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [
                visiblePoints[i - 1].marker.getLngLat().lng,
                visiblePoints[i - 1].marker.getLngLat().lat,
              ],
              [
                visiblePoints[i].marker.getLngLat().lng,
                visiblePoints[i].marker.getLngLat().lat,
              ],
            ],
          },
        })
      }

      ;(map.getSource(id) as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features,
      })
    },
  }

  return line
}
