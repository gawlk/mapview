interface HeavydynUnitsSkeleton<A, B = A, C = A, D = A, E = A> {
  deflection: A
  force: B
  temperature: C
  distance: D
  time: E
}

type HeavydynUnitsNames = keyof HeavydynUnitsSkeleton<any>

type PossibleHeavydynDeflectionUnits = 'mm' | '1/100 mm' | 'um'
type PossibleHeavydynForceUnits = 'N' | 'kN' | 'lbs'
type PossibleHeavydynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleHeavydynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleHeavydynTimeUnits = 's' | 'ms' | 'us'

type JSONHeavydynUnits = HeavydynUnitsSkeleton<
  PossibleHeavydynDeflectionUnits,
  PossibleHeavydynForceUnits,
  PossibleHeavydynTemperatureUnits,
  PossibleHeavydynDistanceUnits,
  PossibleHeavydynTimeUnits
>

type HeavydynMathUnits = HeavydynUnitsSkeleton<
  MathUnit<PossibleHeavydynDeflectionUnits>,
  MathUnit<PossibleHeavydynForceUnits>,
  MathUnit<PossibleHeavydynTemperatureUnits>,
  MathUnit<PossibleHeavydynDistanceUnits>,
  MathUnit<PossibleHeavydynTimeUnits>
>
