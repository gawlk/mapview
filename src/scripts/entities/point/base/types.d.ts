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

interface BasePoint<
  Drop extends BaseDrop = MachineDrop,
  Zone extends BaseZone = BaseZone,
> extends BaseObject<JSONBasePoint> {
  readonly id: string
  readonly date: Date
  readonly marker: mapboxgl.Marker | null
  readonly icon: Icon | null
  readonly settings: JSONPointSettings
  readonly data: DataValue<string>[]
  readonly information: Field[]
  readonly drops: Drop[]
  index: number
  number: number
  zone: Zone
  rawDataFile: ArrayBufferLike | null
  readonly getSelectedMathNumber: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: BaseDropIndex | null,
  ) => MathNumber | undefined
  readonly getDisplayedString: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: BaseDropIndex | null,
  ) => string
  readonly updateColor: () => void
  readonly updateText: () => Promise<void>
  readonly updateVisibility: () => void
  readonly updatePopup: () => void
  readonly addToMap: () => void
  readonly checkVisibility: () => boolean
  readonly remove: () => void
}
