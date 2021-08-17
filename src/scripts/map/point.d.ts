interface Point {
  number: number
  initialCoords: mapboxgl.LngLatLike
  marker: mapboxgl.Marker
  icon: Icon
  isVisible: boolean
  rawData: MathNumberObject
  parametersData: MathNumberObject
  finalData: MathNumberObject
  state: PointState
  selectedData: string
}

type PointState = 'value' | 'number' | 'nothing'
