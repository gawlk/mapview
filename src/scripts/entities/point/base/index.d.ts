interface BasePoint {
  number: number
  initialCoords: mapboxgl.LngLatLike
  marker: mapboxgl.Marker
  icon: Icon
  isVisible: boolean
  data: ComputedData
  state: PointState
  selectedData: number
  clean: () => void
}

type PointState = 'value' | 'number' | 'nothing'

interface JSONPoint {
  coordinates: mapboxgl.LngLatLike
  data: {
    DOP: number
    Chainage: number
  }
  informations: {
    comment: string
    date: string
  }
  drops: JSONDrop[]
}
