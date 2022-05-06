interface MinidynReport extends BaseReport {
  readonly machine: 'Minidyn'
  zones: MinidynZone[]
  platform: MinidynField[]
  informations: MinidynField[]
}

interface MinidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: MinidynMathUnits
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
