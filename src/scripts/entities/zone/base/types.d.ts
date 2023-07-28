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
  color: ColorName
  isVisible: boolean
}

interface JSONZoneSettingsV1 {
  readonly version: 1
  color: ColorNameV1
  isVisible: boolean
}

// ---
// Object
// ---

interface BaseZone<
  Point extends MachinePoint = MachinePoint,
  Report extends BaseReport = BaseReport
> extends BaseObject<JSONBaseZone> {
  readonly points: Point[]
  readonly settings: JSONZoneSettings
  name: string
  report: Report
  data: DataValue<string>[]
  readonly init: () => void
  readonly clean: () => void
  readonly fitOnMap: (map: mapboxgl.Map) => void
  readonly getExportablePoints: () => BasePoint[]
}
