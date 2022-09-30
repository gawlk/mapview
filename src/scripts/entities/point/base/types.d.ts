// ---
// JSON
// ---

type JSONBasePointVAny = JSONBasePoint

interface JSONBasePoint {
  version: 1
  number: number
  index: number
  date: string
  coordinates: mapboxgl.LngLatLike
  data: JSONDataValue[]
  settings: JSONPointSettings
  information: JSONBaseField[]
  drops: JSONDrop[]
}

interface JSONPointSettings {
  version: 1
  isVisible: boolean
}

// ---
// Object
// ---

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
  information: MachineField[]
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
