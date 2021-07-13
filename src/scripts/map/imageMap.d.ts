interface ImageMap {
  id: string
  source: mapboxgl.Source
  markerNW: mapboxgl.Marker
  markerSE: mapboxgl.Marker
}

interface ImageCoordinates {
  tl: XYCoord
  tr: XYCoord
  bl: XYCoord
  br: XYCoord
}
