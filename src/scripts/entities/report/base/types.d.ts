interface BaseReport {
  readonly machine: MachineName
  readonly name: MachineField
  readonly points: MachinePoint[]
  readonly line: Line
  readonly zones: Zone[]
  readonly screenshots: string[]
  readonly dataLabels: ReportDataLabels
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

interface BaseReportCreatorParameters extends MachineReportCreatorParameters {
  machine: MachineName
  groupedDataLabels: SelectableList<GroupedDataLabels>
}

interface JSONReport {
  name: string
  points: JSONPoint[]
  dataLabels: JSONReportDataLabels
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
  choices: SelectableOptionalList<number, string>
  indexes?: SelectableList<number, MachineDropIndex>
}

interface JSONTableDataLabelsParameters {
  from: DataLabelsFrom
  index?: number
  dataLabels: string[]
}

type DataLabelsFrom = 'Drop' | 'Test' | 'Zone'

interface JSONReportSettings {
  iconName: IconName
  isVisible: boolean
  selectedColorization: 'Threshold' | 'Zone'
  threshold: {
    colors: ThresholdColors
    custom: {}
  }
}

interface ThresholdColors {
  low: Color
  middle: Color
  high: Color
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
