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
