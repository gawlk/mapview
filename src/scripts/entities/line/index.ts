import { createWatcherHandler } from '/src/scripts'

export const sortPoints = (points: MachinePoint[]) =>
  points.sort((pointA, pointB) =>
    pointA.number === pointB.number
      ? pointA.settings.isVisible && pointB.settings.isVisible
        ? 0
        : !pointA.settings.isVisible && !pointB.settings.isVisible
        ? 0
        : pointA.settings.isVisible && !pointB.settings.isVisible
        ? 1
        : -1
      : pointA.number - pointB.number
  )

export const createLine = (
  zones: MachineZone[],
  map: mapboxgl.Map | null
): Line => {
  const id = `line-${+new Date()}${Math.random()}`

  let features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] =
    []

  const watcherHandler = createWatcherHandler()

  const line: Line = {
    sortedPoints: computed(() =>
      Array.prototype.concat(...zones.map((zone) => zone.points))
    ),
    addToMap: function () {
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
              features: [],
            },
          } as unknown as mapboxgl.GeoJSONSource,
          type: 'line',
        },
        'lines'
      )

      watcherHandler.add(
        watch(
          () => this.sortedPoints.value.length,
          () => {
            line.update()

            this.sortedPoints.value.forEach((point) => {
              point.marker?.on('drag', () => {
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
    remove: function (): void {
      if (map) {
        map.getLayer(id) && map.removeLayer(id)
        map.getSource(id) && map.removeSource(id)
      }

      watcherHandler.clean()
    },
    update: function (): void {
      const visiblePoints = sortPoints(this.sortedPoints.value).filter(
        (point) => point.checkVisibility()
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
                visiblePoints[i - 1].marker?.getLngLat().lng || 0,
                visiblePoints[i - 1].marker?.getLngLat().lat || 0,
              ],
              [
                visiblePoints[i].marker?.getLngLat().lng || 0,
                visiblePoints[i].marker?.getLngLat().lat || 0,
              ],
            ],
          },
        })
      }

      ;(map?.getSource(id) as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features,
      })
    },
  }

  sortPoints(line.sortedPoints.value)

  return line
}
