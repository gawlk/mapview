interface HeavydynProject extends BaseProject {
  readonly machine: 'Heavydyn'
  readonly reports: SelectableList<HeavydynReport>
}

interface HeavydynMathUnitsSkeleton<A, B = A, C = A, D = A, E = A> {
  deflection: A
  force: B
  temperature: C
  distance: D
  time: E
}

type HeavydynMathUnits = HeavydynMathUnitsSkeleton<MathUnit>

type PossibleHeavydynDeflectionUnits = 'mm' | '1/100 mm' | 'um'
type PossibleHeavydynForceUnits = 'N' | 'kN' | 'lbs'
type PossibleHeavydynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleHeavydynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleHeavydynTimeUnits = 's' | 'ms' | 'us'

type JSONHeavydynUnits = HeavydynMathUnitsSkeleton<
  PossibleHeavydynDeflectionUnits,
  PossibleHeavydynForceUnits,
  PossibleHeavydynTemperatureUnits,
  PossibleHeavydynDistanceUnits,
  PossibleHeavydynTimeUnits
>

type HeavydynMathUnitsNames = keyof HeavydynMathUnitsSkeleton<any>
