interface MaxidynReport extends BaseReport {
  readonly machine: 'Maxidyn'
  zones: MaxidynZone[]
  platform: MaxidynField[]
  informations: MaxidynField[]
}

interface MaxidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: MaxidynMathUnits
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
