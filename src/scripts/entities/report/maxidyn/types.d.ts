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
