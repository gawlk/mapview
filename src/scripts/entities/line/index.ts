import { createWatcherHandler } from '/src/scripts'

export const createLine = (zones: MachineZone[], map: mapboxgl.Map): Line => {
  const id = `line-${+new Date()}${Math.random()}`

  let features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] =
    []

  const watcherHandler = createWatcherHandler()

  const line: Line = {
    sortedPoints: computed(
      () =>
        Array.prototype
          .concat(...zones.map((zone) => zone.points))
          .sort((pointA: MachinePoint, pointB: MachinePoint) => {
            return pointA.number - pointB.number
          }) as MachinePoint[]
    ),
    addToMap: function () {
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
          () => this.sortedPoints.value.length,
          () => {
            line.update()

            this.sortedPoints.value.forEach((point) => {
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
    remove: function (): void {
      map.getLayer(id) && map.removeLayer(id)
      map.getSource(id) && map.removeSource(id)

      watcherHandler.clean()
    },
    update: function (): void {
      const visiblePoints = this.sortedPoints.value.filter((point) =>
        point.isOnMap()
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
