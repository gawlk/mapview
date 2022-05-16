interface MinidynReport extends BaseReport {
  readonly machine: 'Minidyn'
  readonly zones: MinidynZone[]
  platform: MinidynField[]
  informations: MinidynField[]
  project: MinidynProject
}

interface MinidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  project: MinidynProject
}

type MinidynDropType = 'Training' | 'Averaging'

interface MinidynDropIndex extends BaseDropIndex {
  machine: 'Minidyn'
  type: MinidynDropType
}

type MinidynThresholds = MinidynMathUnitsSkeleton<AnyThreshold[]>

interface JSONMinidynChoice extends JSONChoice {
  unit: MinidynMathUnitsNames | string
}
