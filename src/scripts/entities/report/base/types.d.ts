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
  readonly dataLabels: JSONBaseReportDataLabels
  readonly thresholds: JSONBaseReportThresholds
}

interface JSONBaseReportDataLabels {
  readonly version: 1
  readonly table: SelectableList<number, JSONTableDataLabelsParameters>
}

interface JSONTableDataLabelsParameters {
  readonly version: 1
  readonly from: DataLabelsFrom
  readonly index?: number
  readonly dataLabels: string[]
}

type DataLabelsFrom = 'Drop' | 'Test' | 'Zone'

interface JSONBaseReportThresholds {
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

interface BaseReport {
  readonly machine: MachineName
  readonly name: Field
  readonly line: Line
  readonly zones: MachineZone[]
  readonly screenshots: string[]
  readonly dataLabels: MachineReportDataLabels
  readonly thresholds: MachineReportThresholds
  readonly settings: JSONReportSettings
  readonly platform: Field[]
  readonly information: Field[]
  project: MachineProject
  isOnMap: boolean
  readonly fitOnMap: () => void
  readonly toBaseJSON: () => JSONBaseReport
  addToMap: () => void
  remove: () => void
}

interface BaseReportDataLabels {
  readonly groups: SelectableList<BaseGroupedDataLabels>
  readonly table: SelectableList<BaseTableDataLabelsParameters>
}

interface BaseGroupedDataLabels {
  readonly from: DataLabelsFrom
  readonly choices: SelectableList<DataLabel<string>>
  readonly indexes?: SelectableList<MachineDropIndex>
}

interface BaseTableDataLabelsParameters {
  readonly group: MachineGroupedDataLabels
  readonly index?: MachineDropIndex
  readonly dataLabels: DataLabel<string>[]
}

interface BaseReportThresholds {
  readonly groups: MachineUnitsSkeleton<GroupedThresolds<string>>
  readonly colors: JSONThresholdColors
  readonly inputs: JSONThresholdInputs
}

interface GroupedThresolds<T> {
  readonly unit: MathUnit<T>
  readonly choices: SelectableList<AnyThreshold>
}
