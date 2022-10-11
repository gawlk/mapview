// ---
// JSON
// ---

interface JSONImage {
  version: 1
  name: string
  opacity?: number
  coordinates?: {
    nw: LngLat
    se: LngLat
  }
}

// ---
// Object
// ---

interface Image {
  id: string
  sourceData: mapboxgl.ImageSourceRaw
  markerNW: mapboxgl.Marker
  markerSE: mapboxgl.Marker
  opacity: number
  addToMap: (isVisible: boolean) => void
  remove: () => void
  toJSON: () => JSONImage
}

interface ImageCoordinates {
  tl: XYCoord
  tr: XYCoord
  bl: XYCoord
  br: XYCoord
}
