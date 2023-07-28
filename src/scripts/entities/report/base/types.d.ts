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
  readonly colors: JSONThresholdColorsVAny
  readonly inputs: JSONThresholdInputs
}

type JSONThresholdColorsVAny = JSONThresholdColors | JSONThresholdColorsV1

interface JSONThresholdColors {
  readonly version: 2
  low: ColorName
  middle: ColorName
  high: ColorName
}

interface JSONThresholdColorsV1 {
  readonly version: 1
  low: ColorNameV1
  middle: ColorNameV1
  high: ColorNameV1
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
> extends BaseObject<JSONBaseReport>,
    Entity<'Report'> {
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
  readonly addToMap: () => void
  readonly remove: () => void
  readonly getExportablePoints: () => BasePoint[]
}
