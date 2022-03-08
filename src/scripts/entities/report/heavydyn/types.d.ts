interface HeavydynReport extends BaseReport {
  readonly machine: 'heavydyn'
  points: HeavydynPoint[]
  platform: HeavydynField[]
  informations: HeavydynField[]
}

interface HeavydynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: HeavydynUnits
}

type HeavydynDropType = 'Distance' | 'Force'

interface HeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'heavydyn'
  readonly type: HeavydynDropType
}
