interface BaseReport {
  readonly machine: MachineName
  readonly name: MachineField
  readonly points: MachinePoint[]
  readonly line: Line
  readonly zones: Zone[]
  readonly screenshots: string[]
  readonly valuesNames: ReportValuesNames
  readonly settings: JSONReportSettings
  readonly platform: MachineField[]
  readonly informations: MachineField[]
  isOnMap: boolean
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
}

interface ReportValuesNames {
  groups: SelectableList<GroupedValuesNames>
  table: SelectableList<TableValuesNamesParameters>
}

interface GroupedValuesNames {
  from: ValuesNamesFrom
  choices: SelectableList<ValueName>
  indexes?: SelectableList<MachineDropIndex>
}

interface TableValuesNamesParameters {
  group: GroupedValuesNames
  index?: MachineDropIndex
  valuesNames: ValueName[]
}

interface ValueName {
  name: string
  unit: MathUnit
  // calculate: () => {}
}

interface BaseReportCreatorParameters extends MachineReportCreatorParameters {
  machine: MachineName
  groupedValuesNames: SelectableList<GroupedValuesNames>
}

interface JSONReport {
  name: string
  points: JSONPoint[]
  valuesNames: JSONReportValuesNames
  zones: JSONZone[]
  settings: JSONReportSettings
  screenshots: number[]
  platform: JSONField[]
  informations: JSONField[]
}

interface JSONReportValuesNames {
  groups: SelectableList<number, JSONGroupedValuesNames>
  table: SelectableList<number, JSONTableValuesNames>
}

interface JSONGroupedValuesNames {
  from: ValuesNamesFrom
  choices: SelectableOptionalList<number, string>
  indexes?: SelectableList<number, MachineDropIndex>
}

interface JSONTableValuesNames {
  from: ValuesNamesFrom
  index?: number
  valuesNames: string[]
}

type ValuesNamesFrom = 'Drop' | 'Test' | 'Zone'

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
