interface BasePoint {
  readonly machine: MachineName
  readonly id: string
  number: number
  index: number
  date: Date
  marker: mapboxgl.Marker | null
  icon: Icon | null
  settings: JSONPointSettings
  data: DataValue[]
  informations: MachineField[]
  readonly drops: MachineDrop[]
  zone: MachineZone
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
  updatePopup: () => void
  addToMap: () => void
  checkVisibility: () => boolean
  remove: () => void
}

interface BasePointCreatorParameters extends MachinePointCreatorParameters {
  machine: MachineName
}

interface JSONPoint {
  id: string
  number: number
  index: number
  date: string
  coordinates: mapboxgl.LngLatLike
  data: JSONDataValue[]
  settings: JSONPointSettings
  informations: JSONField[]
  drops: JSONDrop[]
}

interface JSONPointSettings {
  isVisible: boolean
}
