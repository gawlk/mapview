// ---
// JSON
// ---

type JSONBasePointVAny = JSONBasePoint

interface JSONBasePoint {
  readonly version: 1
  readonly id: string
  readonly number: number
  readonly index: number
  readonly date: string
  readonly coordinates: mapboxgl.LngLatLike
  readonly data: JSONDataValue[]
  readonly settings: JSONPointSettings
  readonly information: JSONField[]
  readonly drops: JSONMachineDrop[]
}

interface JSONPointSettings {
  readonly version: 1
  isVisible: boolean
}

// ---
// Object
// ---

interface BasePoint {
  readonly machine: MachineName
  readonly id: string
  readonly date: Date
  readonly marker: mapboxgl.Marker | null
  readonly icon: Icon | null
  readonly settings: JSONPointSettings
  readonly data: DataValue<string>[]
  readonly information: Field[]
  readonly drops: MachineDrop[]
  index: number
  number: number
  zone: MachineZone
  rawDataFile: ArrayBufferLike | null
  readonly getSelectedMathNumber: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: MachineDropIndex | null
  ) => MathNumber | undefined
  readonly getDisplayedString: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: MachineDropIndex | null
  ) => string
  readonly updateColor: () => void
  readonly updateText: () => void
  readonly updateVisibility: () => void
  readonly updatePopup: () => void
  readonly addToMap: () => void
  readonly checkVisibility: () => boolean
  readonly remove: () => void
  readonly toBaseJSON: () => JSONBasePoint
}
