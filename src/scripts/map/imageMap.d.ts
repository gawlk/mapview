interface ImageMap {
  layerId: string
  sourceId: string
  sourceData: mapboxgl.ImageSourceRaw
  markerNW: mapboxgl.Marker
  markerSE: mapboxgl.Marker
  opacity: number
  addToMap: (isVisible: boolean) => void
  remove: () => void
}

interface ImageCoordinates {
  tl: XYCoord
  tr: XYCoord
  bl: XYCoord
  br: XYCoord
}
