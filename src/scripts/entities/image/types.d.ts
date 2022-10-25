// ---
// JSON
// ---

interface JSONImage {
  readonly version: 1
  readonly name: string
  readonly opacity?: number
  readonly coordinates?: {
    nw: LngLat
    se: LngLat
  }
}

// ---
// Object
// ---

interface Image {
  readonly id: string
  readonly sourceData: mapboxgl.ImageSourceRaw
  readonly markerNW: mapboxgl.Marker
  readonly markerSE: mapboxgl.Marker
  opacity: number
  readonly addToMap: (isVisible: boolean) => void
  readonly remove: () => void
  readonly toJSON: () => JSONImage
}

interface ImageCoordinates {
  readonly tl: XYCoord
  readonly tr: XYCoord
  readonly bl: XYCoord
  readonly br: XYCoord
}
