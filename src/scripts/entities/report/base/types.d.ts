interface BaseReport {
  readonly machine: MachineName
  readonly name: MachineField
  readonly line: Line
  readonly zones: MachineZone[]
  readonly screenshots: string[]
  readonly dataLabels: ReportDataLabels
  readonly thresholds: ReportThresholds
  readonly settings: JSONReportSettings
  readonly platform: MachineField[]
  readonly informations: MachineField[]
  isOnMap: boolean
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
}

interface ReportDataLabels {
  groups: SelectableList<GroupedDataLabels>
  table: SelectableList<TableDataLabelsParameters>
}

interface GroupedDataLabels {
  from: DataLabelsFrom
  choices: SelectableList<DataLabel>
  indexes?: SelectableList<MachineDropIndex>
}

interface TableDataLabelsParameters {
  group: GroupedDataLabels
  index?: MachineDropIndex
  dataLabels: DataLabel[]
}

interface ReportThresholds {
  groups: GroupedThresolds[]
  colors: ThresholdColors
  inputs: ThresholdInputs
}

interface GroupedThresolds {
  unit: MathUnit
  choices: SelectableList<AnyThreshold>
}

interface ThresholdColors {
  low: ColorName
  middle: ColorName
  high: ColorName
}

interface BaseReportCreatorParameters extends MachineReportCreatorParameters {
  machine: MachineName
  units: MachineMathUnits
  thresholds: MachineThresholds
}

interface JSONReport {
  name: string
  dataLabels: JSONReportDataLabels
  thresholds: JSONReportThresholds
  zones: JSONZone[]
  settings: JSONReportSettings
  screenshots: number[]
  platform: JSONField[]
  informations: JSONField[]
}

interface JSONReportDataLabels {
  groups: SelectableList<number, JSONGroupedDataLabels>
  table: SelectableList<number, JSONTableDataLabelsParameters>
}

interface JSONGroupedDataLabels {
  from: DataLabelsFrom
  choices: SelectableList<number, JSONChoice>
  indexes?: SelectableList<number, JSONMachineDropIndex>
}

interface JSONChoice {
  name: string
  unit: string
}

interface JSONTableDataLabelsParameters {
  from: DataLabelsFrom
  index?: number
  dataLabels: string[]
}

interface JSONReportThresholds {
  groups: MachineMathUnitsSkeleton<number>
  colors: ThresholdColors
  inputs: ThresholdInputs
}

type DataLabelsFrom = 'Drop' | 'Test' | 'Zone'

interface JSONReportSettings {
  iconName: IconName
  isVisible: boolean
  colorization: ReportColorizationPossibilities
  groupBy: ReportGroupByPossibilities
}

type ReportColorizationPossibilities = 'Threshold' | 'Zone'

type ReportGroupByPossibilities = 'Nothing' | 'Zone'

interface ThresholdColors {
  low: ColorName
  middle: ColorName
  high: ColorName
}

interface ThresholdInputs {
  isRequiredARange: boolean
  isOptionalARange: boolean
}

interface BaseDropIndex {
  readonly machine: MachineName
  readonly type: string
  readonly displayedIndex: number
}

// interface JSONLoadBearingCapacity {
//   name: string
//   AlgoRaideur: string
//   AlgoProcessing1: string
//   AlgoProcessing2: string
//   DPlaque: number
//   CPoisson: number
//   FForme: number
//   k: number
//   alpha: number
//   minPortance: number
//   maxPortance: number
// }

// interface JSONMachineDetails {
//   serial: string
//   assignment: string
//   MAC: string
//   licenceStart: string
//   licenceEnd: string
//   certificationStart: string
//   certificationEnd: string
// }

// interface JSONDropsSettings {
//   count: {
//     training: number
//     total: number
//     selected: number
//   }
//   data: {
//     selected: number
//     names: string[]
//   }
// }
