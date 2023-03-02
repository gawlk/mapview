import { createWatcherHandler } from '/src/scripts'

export const createLine = (map: mapboxgl.Map | null): Line => {
  const id = `line-${+new Date()}${Math.random()}`

  let features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] =
    []

  const watcherHandler = createWatcherHandler()

  const line: Line = shallowReactive({
    sortedPoints: shallowReactive([] as BasePoint[]),
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
          () => this.sortedPoints.length,
          () => {
            line.update()

            this.sortedPoints.forEach((point) => {
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
      sortPoints(this.sortedPoints)

      const visiblePoints = this.sortedPoints.filter((point) => {
        const {
          settings,
          zone: {
            settings: zSettings,
            report: { settings: rSettings },
          },
        } = point

        return settings.isVisible && zSettings.isVisible && rSettings.isVisible
      })

      features = []

      for (let i = 1; i < visiblePoints.length; i++) {
        features.push({
          type: 'Feature',
          properties: {
            color: visiblePoints[i - 1].icon?.color || 'gray',
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

      ;(map?.getSource(id) as mapboxgl.GeoJSONSource)?.setData({
        type: 'FeatureCollection',
        features,
      })
    },
  })

  return line
}

export const sortPoints = (points: BasePoint[]) =>
  points.sort((pointA, pointB) => pointA.index - pointB.index)
