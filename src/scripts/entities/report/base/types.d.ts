// ---
// JSON
// ---

type JSONBaseReportVAny = JSONBaseReport

interface JSONBaseReport {
  readonly version: 1
  readonly name: string
  readonly zones: JSONMachineZone[]
  readonly settings: JSONReportSettings
  readonly screenshots: number[]
  readonly platform: JSONField[]
  readonly information: JSONField[]
  readonly dataLabels: JSONBaseDataLabels
  readonly thresholds: JSONBaseThresholdsSettings
}

// Settings only
interface JSONBaseThresholdsSettings {
  readonly version: 1
  colors: JSONThresholdColors
  inputs: JSONThresholdInputs
}

interface JSONThresholdColors {
  readonly version: 1
  low: ColorName
  middle: ColorName
  high: ColorName
}

interface JSONThresholdInputs {
  readonly version: 1
  isRequiredARange: boolean
  isOptionalARange: boolean
}

interface JSONReportSettings {
  readonly version: 1
  iconName: IconName
  isVisible: boolean
  colorization: ReportColorization
  groupBy: ReportGroupBy
}

type ReportColorization = 'Threshold' | 'Zone'

type ReportGroupBy = 'Number' | 'Zone'

// ---
// Object
// ---

interface BaseReport<
  Project extends BaseProject = BaseProject,
  Zone extends BaseZone = MachineZone,
  DataLabels extends BaseDataLabels = MachineDataLabels,
  Thresholds extends BaseThresholds = BaseThresholds
> extends BaseObject<JSONBaseReport> {
  readonly name: Field
  readonly line: Line
  readonly zones: Zone[]
  readonly screenshots: string[]
  readonly dataLabels: DataLabels
  readonly thresholds: Thresholds
  readonly settings: JSONReportSettings
  readonly platform: Field[]
  readonly information: Field[]
  project: Project
  isOnMap: boolean
  readonly fitOnMap: () => void
  addToMap: () => void
  remove: () => void
}
