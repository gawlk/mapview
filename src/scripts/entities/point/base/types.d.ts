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
  readonly isVisible: boolean
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
  readonly settings: PointSettings
  readonly dataset: ReactiveMap<DataLabel, DataValue<string>>
  readonly information: Field[]
  readonly drops: Drop[]
  readonly index: ASS<number>
  readonly number: ASS<number>
  readonly coordinates: ASS<mapboxgl.LngLat | undefined>
  readonly zone: ASS<Zone>
  readonly rawDataFile: ASS<ArrayBufferLike | null>
  readonly onMapMathNumber: Accessor<MathNumber | undefined>
  readonly getMathNumber: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: BaseDropIndex | null,
  ) => MathNumber | undefined
  readonly getDisplayedString: (
    groupFrom: DataLabelsFrom,
    dataLabel: DataLabel<string>,
    index?: BaseDropIndex | null,
  ) => string
  readonly shouldBeOnMap: () => boolean
}

interface PointSettings extends SerializableObject<JSONPointSettings> {
  readonly isVisible: ASS<boolean>
}
