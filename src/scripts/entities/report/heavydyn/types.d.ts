interface HeavydynReport extends BaseReport {
  readonly machine: 'Heavydyn'
  zones: HeavydynZone[]
  platform: HeavydynField[]
  informations: HeavydynField[]
}

interface HeavydynReportCreatorParameters
  extends MachineReportCreatorParameters {
  units: HeavydynMathUnits
}

type HeavydynDropType = 'Distance' | 'Force' | 'Time' | 'Load' | 'Height'

interface HeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'Heavydyn'
  readonly type: HeavydynDropType
  readonly value: MathNumber
}

interface JSONHeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'Heavydyn'
  readonly type: HeavydynDropType
  readonly value: number
}

type HeavydynThresholds = HeavydynMathUnitsSkeleton<AnyThreshold[]>

interface JSONHeavydynChoice extends JSONChoice {
  unit: HeavydynMathUnitsNames | string
}
