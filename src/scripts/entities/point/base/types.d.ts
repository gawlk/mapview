interface BasePoint {
  readonly machine: MachineName
  readonly id: string
  number: number
  // coordinates: mapboxgl.LngLatLike
  marker: mapboxgl.Marker
  icon: Icon
  settings: JSONPointSettings
  zone: Zone
  data: DataValue[]
  drops: MachineDrop[]
  getSelectedMathNumber: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel,
    index?: MachineDropIndex | null
  ) => MathNumber | undefined
  getDisplayedString: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel,
    index?: MachineDropIndex | null
  ) => string
  updateColor: () => void
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
  data: JSONDataValue[]
  settings: JSONPointSettings
  informations: JSONField[]
  drops: JSONDrop[]
  zone: number
}

interface JSONPointSettings {
  isVisible: boolean
  previousNumber?: number | null
}
