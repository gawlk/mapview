interface MaxidynReport extends BaseReport {
  readonly machine: 'maxidyn'
  points: MaxidynPoint[]
  platform: MaxidynField[]
  informations: MaxidynField[]
}

interface MaxidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: MaxidynUnits
}

type MaxidynDropType = 'Training' | 'Averaging'

interface MaxidynDropIndex extends BaseDropIndex {
  machine: 'maxidyn'
  type: MaxidynDropType
}
