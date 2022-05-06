interface BasePoint {
  readonly machine: MachineName
  readonly id: string
  number: number
  marker: mapboxgl.Marker
  icon: Icon
  settings: JSONPointSettings
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
  updatePopup: () => void
  addToMap: () => void
  isOnMap: () => boolean
  remove: () => void
}

interface BasePointCreatorParameters extends MachinePointCreatorParameters {
  machine: MachineName
}

interface JSONPoint {
  number: number
  coordinates: mapboxgl.LngLatLike
  data: JSONDataValue[]
  settings: JSONPointSettings
  informations: JSONField[]
  drops: JSONDrop[]
}

interface JSONPointSettings {
  isVisible: boolean
  previousNumber?: number | null
}
