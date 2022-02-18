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
