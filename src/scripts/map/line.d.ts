interface Line {
  id: string
  features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[]
  addToMap: () => void
  remove: () => void
  update: () => void
}
