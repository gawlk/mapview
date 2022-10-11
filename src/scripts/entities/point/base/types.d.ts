// ---
// JSON
// ---

type JSONBasePointVAny = JSONBasePoint

interface JSONBasePoint {
  version: 1
  id: string
  number: number
  index: number
  date: string
  coordinates: mapboxgl.LngLatLike
  data: JSONDataValue[]
  settings: JSONPointSettings
  information: JSONField[]
  drops: JSONMachineDrop[]
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
  data: DataValue<string>[]
  rawDataFile: ArrayBufferLike | null
  information: Field[]
  readonly drops: MachineDrop[]
  zone: MachineZone
  getSelectedMathNumber: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: MachineDropIndex | null
  ) => MathNumber | undefined
  getDisplayedString: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: MachineDropIndex | null
  ) => string
  updateColor: () => void
  updateText: () => void
  updateVisibility: () => void
  updatePopup: () => void
  addToMap: () => void
  checkVisibility: () => boolean
  remove: () => void
  toBaseJSON: () => JSONBasePoint
}
