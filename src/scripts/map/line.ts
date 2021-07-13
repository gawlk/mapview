export const createLine = (points: Point[], map: mapboxgl.Map): Line => {
  const line: Line = {
    id: `${+new Date()}`,
    features: [],
    addToMap: function (): void {
      if (!map.getLayer(this.id)) {
        map.addLayer({
          id: this.id,
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
              features: this.features,
            },
          } as unknown as mapboxgl.GeoJSONSource,
          type: 'line',
        })
      }

      this.update()
    },
    remove: function (): void {
      if (map.getLayer(this.id)) {
        map.removeLayer(this.id)
        map.removeSource(this.id)
      }
    },
    update: function (): void {
      const visiblePoints = points.filter((point) => point.isVisible)

      this.features = []

      for (let i = 1; i < visiblePoints.length; i++) {
        this.features.push({
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

      if (map.getSource(this.id)) {
        ;(map.getSource(this.id) as mapboxgl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: this.features,
        })
      }
    },
  }

  line.addToMap()

  points.forEach((point) => {
    point.marker.on('drag', () => {
      line.update()
    })
  })

  return line
}
