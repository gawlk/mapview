interface BaseReport {
  kind: MachineName
  name: string
  screenshots: string[]
  points: MachinePoint[]
  line: Line
  mapviewSettings: JSONReportMapviewSettings
  machineDetails: JSONMachineDetails
  dropsSettings: JSONDropsSettings
  platform: Field[]
  informations: Field[]
  clean: () => void
}

interface JSONReport {
  name: string
  mapviewSettings: JSONReportMapviewSettings
  thresholdSettings: JSONThresholdSettings
  loadBearingCapacity: JSONLoadBearingCapacity
  machineDetails: JSONMachineDetails
  dropsSettings: JSONDropsSettings
  screenshots: number[]
  platform: JSONField[]
  informations: JSONField[]
  points: JSONPoint[]
}

interface JSONReportMapviewSettings {
  iconName: IconName
  isVisible: boolean
}

interface JSONThresholdSettings {
  current: string
  custom: {}
}

interface JSONLoadBearingCapacity {
  name: string
  AlgoRaideur: string
  AlgoProcessing1: string
  AlgoProcessing2: string
  DPlaque: number
  CPoisson: number
  FForme: number
  k: number
  alpha: number
  minPortance: number
  maxPortance: number
}

interface JSONMachineDetails {
  serial: string
  assignment: string
  MAC: string
  licenceStart: string
  licenceEnd: string
  certificationStart: string
  certificationEnd: string
}

interface JSONDropsSettings {
  count: {
    training: number
    total: number
    selected: number
  }
  data: {
    selected: number
    names: string[]
  }
}
