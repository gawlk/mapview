import { watch } from 'vue'

import { createWatcherHandler } from '/src/scripts'

export const createLine = (points: Point[], map: mapboxgl.Map): Line => {
  const id = `${+new Date()}`
  let features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] =
    []

  const watcherHandler = createWatcherHandler()

  const line: Line = {
    addToMap(): void {
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
      map.removeLayer(id)
      map.removeSource(id)

      watcherHandler.clean()
    },
    update: (): void => {
      const visiblePoints = points.filter((point) => point.isVisible)

      features = []

      for (let i = 1; i < visiblePoints.length; i++) {
        features.push({
          type: 'Feature',
          properties: {
            color: '#666666',
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

  line.addToMap()

  return line
}
