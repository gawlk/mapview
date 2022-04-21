interface MaxidynReport extends BaseReport {
  readonly machine: 'maxidyn'
  points: MaxidynPoint[]
  platform: MaxidynField[]
  informations: MaxidynField[]
}

interface MaxidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: MaxidynMathUnits
}

type MaxidynDropType = 'Training' | 'Averaging'

interface MaxidynDropIndex extends BaseDropIndex {
  machine: 'maxidyn'
  type: MaxidynDropType
}

type MaxidynThresholds = MaxidynMathUnitsSkeleton<AnyThreshold[]>

interface JSONMaxidynChoice extends JSONChoice {
  unit: MaxidynMathUnitsNames | string
}
