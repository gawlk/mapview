interface Image {
  id: string
  sourceData: mapboxgl.ImageSourceRaw
  markerNW: mapboxgl.Marker
  markerSE: mapboxgl.Marker
  opacity: number
  addToMap: (isVisible: boolean) => void
  remove: () => void
}

interface JSONImage {
  name: string
  opacity?: number
  coordinates?: {
    nw: LngLat
    se: LngLat
  }
}

interface ImageCoordinates {
  tl: XYCoord
  tr: XYCoord
  bl: XYCoord
  br: XYCoord
}