interface MinidynReport extends BaseReport {
  readonly machine: 'minidyn'
  points: MinidynPoint[]
  platform: MinidynField[]
  informations: MinidynField[]
}

interface MinidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: MinidynUnits
}

type MinidynDropType = 'Training' | 'Averaging'

interface MinidynDropIndex extends BaseDropIndex {
  machine: 'minidyn'
  type: MinidynDropType
}
