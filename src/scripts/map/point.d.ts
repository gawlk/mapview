interface Point {
  number: number
  initialCoords: mapboxgl.LngLatLike
  marker: mapboxgl.Marker
  icon: Icon
  isVisible: boolean
  rawData: MathNumberObject
  parametersData: MathNumberObject
  finalData: MathNumberObject
}
