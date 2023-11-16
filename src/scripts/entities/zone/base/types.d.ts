// ---
// JSON
// ---

type JSONBaseZoneVAny = JSONBaseZone

interface JSONBaseZone {
  readonly version: 1
  readonly name: string
  readonly points: JSONMachinePoint[]
  readonly settings: JSONZoneSettingsVAny
}

type JSONZoneSettingsVAny = JSONZoneSettings | JSONZoneSettingsV1

interface JSONZoneSettings {
  readonly version: 2
  readonly color: ColorName
  readonly isVisible: boolean
}

interface JSONZoneSettingsV1 {
  readonly version: 1
  readonly color: ColorNameV1
  readonly isVisible: boolean
}

// ---
// Object
// ---

interface BaseZone<
  Point extends MachinePoint = MachinePoint,
  Report extends BaseReport = BaseReport,
> extends BaseObject<JSONBaseZone> {
  readonly points: Accessor<Point[]>
  readonly setPoints: (points: BasePoint[]) => void
  readonly exportablePoints: Accessor<BasePoint[]>
  readonly settings: ZoneSettings
  readonly name: ASS<string>
  readonly report: ASS<Report>
  readonly dataset: ReactiveMap<DataLabel, DataValue<string>>
  readonly fitOnMap: (map: mapboxgl.Map) => void
}

interface ZoneSettings extends SerializableObject<JSONZoneSettings> {
  readonly color: ASS<ColorName>
  readonly isVisible: ASS<boolean>
}
