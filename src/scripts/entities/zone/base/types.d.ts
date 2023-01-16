// ---
// JSON
// ---

type JSONBaseZoneVAny = JSONBaseZone

interface JSONBaseZone {
  readonly version: 1
  readonly name: string
  readonly points: JSONMachinePoint[]
  readonly settings: JSONZoneSettings
}

interface JSONZoneSettings {
  readonly version: 1
  color: ColorName
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
}
