// ---
// JSON
// ---

type JSONBaseReportVAny = JSONBaseReport

interface JSONBaseReport {
  version: 1
  name: string
  zones: JSONMachineZone[]
  settings: JSONReportSettings
  screenshots: number[]
  platform: JSONField[]
  information: JSONField[]
  dataLabels: JSONBaseReportDataLabels
  thresholds: JSONBaseReportThresholds
}

interface JSONBaseReportDataLabels {
  version: 1
  table: SelectableList<number, JSONTableDataLabelsParameters>
}

interface JSONTableDataLabelsParameters {
  version: 1
  from: DataLabelsFrom
  index?: number
  dataLabels: string[]
}

type DataLabelsFrom = 'Drop' | 'Test' | 'Zone'

interface JSONBaseReportThresholds {
  version: 1
  groups: MachineUnitsSkeleton<number>
  colors: JSONThresholdColors
  inputs: JSONThresholdInputs
}

interface JSONThresholdColors {
  version: 1
  low: ColorName
  middle: ColorName
  high: ColorName
}

interface JSONThresholdInputs {
  version: 1
  isRequiredARange: boolean
  isOptionalARange: boolean
}

interface JSONReportSettings {
  version: 1
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

interface BaseReport {
  readonly machine: MachineName
  readonly name: Field
  readonly line: Line
  readonly zones: MachineZone[]
  readonly screenshots: string[]
  readonly dataLabels: MachineReportDataLabels
  readonly thresholds: ReportThresholds
  readonly settings: JSONReportSettings
  readonly platform: Field[]
  readonly information: Field[]
  project: MachineProject
  isOnMap: boolean
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
  toBaseJSON: () => JSONBaseReport
}

interface BaseReportDataLabels {
  groups: SelectableList<BaseGroupedDataLabels>
  table: SelectableList<BaseTableDataLabelsParameters>
}

interface BaseGroupedDataLabels {
  from: DataLabelsFrom
  choices: SelectableList<DataLabel<string>>
  indexes?: SelectableList<MachineDropIndex>
}

interface BaseTableDataLabelsParameters {
  group: MachineGroupedDataLabels
  index?: MachineDropIndex
  dataLabels: DataLabel<string>[]
}

interface ReportThresholds {
  groups: GroupedThresolds<string>[]
  colors: JSONThresholdColors
  inputs: JSONThresholdInputs
}

interface GroupedThresolds<T> {
  unit: MathUnit<T>
  choices: SelectableList<AnyThreshold>
}
