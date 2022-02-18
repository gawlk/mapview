interface BaseReport {
  readonly machine: MachineName
  name: MachineField
  screenshots: string[]
  points: MachinePoint[]
  zones: Zone[]
  line: Line
  isOnMap: boolean
  settings: JSONReportSettings
  valuesNames: BaseReportValuesNames
  platform: MachineField[]
  informations: MachineField[]
  fitOnMap: () => void
  addToMap: () => void
  remove: () => void
}

interface ValueName {
  name: string
  unit: MathUnit
}

interface BaseReportValuesNames {
  selectedList: ValuesLists
  drop: SelectableList<ValueName>
  point: SelectableList<ValueName>
  zone: SelectableList<ValueName>
}

interface BaseReportCreatorParameters extends MachineReportCreatorParameters {
  machine: MachineName
  dropList: ValueName[]
  pointList: ValueName[]
  zoneList: ValueName[]
}

interface JSONReport {
  name: string
  values: JSONReportValuesNames
  settings: JSONReportSettings
  // thresholdSettings: JSONThresholdSettings
  // loadBearingCapacity: JSONLoadBearingCapacity
  // machineDetails: JSONMachineDetails
  // dropsSettings: JSONDropsSettings
  screenshots: number[]
  platform: JSONField[]
  informations: JSONField[]
  points: JSONPoint[]
  zones: JSONZone[]
}

interface JSONReportValuesNames {
  selectedList: ValuesLists
  drop: SelectableOptionalList<number, string>
  point: SelectableOptionalList<number, string>
  zone: SelectableOptionalList<number, string>
}

type ValuesLists = 'Drop' | 'Point' | 'Zone'

interface JSONReportSettings {
  iconName: IconName
  isVisible: boolean
  selectedColorization: 'Threshold' | 'Zone'
}

// interface JSONThresholdSettings {
//   current: string
//   custom: {}
// }

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
