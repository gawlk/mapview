interface MaxidynReport extends BaseReport {
  readonly machine: 'Maxidyn'
  readonly zones: MaxidynZone[]
  platform: MaxidynField[]
  informations: MaxidynField[]
  project: MaxidynProject
}

interface MaxidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  project: MaxidynProject
}

type MaxidynDropType = 'Training' | 'Averaging'

interface MaxidynDropIndex extends BaseDropIndex {
  machine: 'Maxidyn'
  type: MaxidynDropType
}

type MaxidynThresholds = MaxidynMathUnitsSkeleton<AnyThreshold[]>

interface JSONMaxidynChoice extends JSONChoice {
  unit: MaxidynMathUnitsNames | string
}
