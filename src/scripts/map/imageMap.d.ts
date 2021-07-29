interface ImageMap {
  sourceId: string
  sourceData: mapboxgl.ImageSourceRaw
  markerNW: mapboxgl.Marker
  markerSE: mapboxgl.Marker
  isVisible: boolean
  addToMap: () => void
  remove: () => void
}

interface ImageCoordinates {
  tl: XYCoord
  tr: XYCoord
  bl: XYCoord
  br: XYCoord
}
