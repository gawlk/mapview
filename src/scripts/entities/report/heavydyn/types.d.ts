interface HeavydynReport extends BaseReport {
  readonly machine: 'Heavydyn'
  readonly zones: HeavydynZone[]
  platform: HeavydynField[]
  informations: HeavydynField[]
  project: HeavydynProject
}

interface HeavydynReportCreatorParameters
  extends MachineReportCreatorParameters {
  project: HeavydynProject
}

type HeavydynDropType = 'Distance' | 'Load' | 'Time' | 'Load' | 'Height'

interface HeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'Heavydyn'
  readonly type: HeavydynDropType
  value: MathNumber
}

interface JSONHeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'Heavydyn'
  readonly type: HeavydynDropType
  value: number
  readonly unit: string
}

type HeavydynThresholds = HeavydynMathUnitsSkeleton<AnyThreshold[]>

interface JSONHeavydynChoice extends JSONChoice {
  unit: HeavydynMathUnitsNames | string
}
