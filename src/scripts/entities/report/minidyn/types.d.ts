interface MinidynReport extends BaseReport {
  readonly machine: 'minidyn'
  points: MinidynPoint[]
  platform: MinidynField[]
  informations: MinidynField[]
}

interface MinidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: MinidynMathUnits
}

type MinidynDropType = 'Training' | 'Averaging'

interface MinidynDropIndex extends BaseDropIndex {
  machine: 'minidyn'
  type: MinidynDropType
}

type MinidynThresholds = MinidynMathUnitsSkeleton<AnyThreshold[]>

interface JSONMinidynChoice extends JSONChoice {
  unit: MinidynMathUnitsNames | string
}
