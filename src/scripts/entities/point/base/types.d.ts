interface BasePoint {
  readonly machine: MachineName
  number: number
  // coordinates: mapboxgl.LngLatLike
  marker: mapboxgl.Marker
  icon: Icon
  settings: JSONPointSettings
  zone: Zone | null
  // data: MathUnit[]
  // drops: MachineDrop[]
  updateText: () => void
  updateVisibility: () => void
  addToMap: () => void
  remove: () => void
}

interface BasePointCreatorParameters extends MachinePointCreatorParameters {
  machine: MachineName
}

interface JSONPoint {
  coordinates: mapboxgl.LngLatLike
  // data: {
  //   DOP: number
  //   Chainage: number
  // }
  settings: JSONPointSettings
  informations: JSONField[]
  drops: JSONDrop[]
}

interface JSONPointSettings {
  isVisible: boolean
}
