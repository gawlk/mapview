// ---
// JSON
// ---

interface JSONOverlay {
  readonly version: 1
  readonly name: string
  readonly opacity?: number
  readonly coordinates?: {
    readonly nw: LngLat
    readonly se: LngLat
  }
}

// ---
// Object
// ---

interface Overlay {
  readonly id: string
  readonly sourceData: mapboxgl.ImageSourceRaw
  readonly markerNW: mapboxgl.Marker | null
  readonly markerSE: mapboxgl.Marker | null
  readonly opacity: ASS<number>
  readonly addToMap: VoidFunction
  readonly removeFromMap: VoidFunction
  readonly refresh: VoidFunction
  readonly toJSON: () => JSONOverlay
}

interface ImageCoordinates {
  readonly tl: XYCoord
  readonly tr: XYCoord
  readonly bl: XYCoord
  readonly br: XYCoord
}
