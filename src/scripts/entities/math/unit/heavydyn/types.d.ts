interface HeavydynUnitsSkeleton<A, B = A, C = A, D = A, E = A> {
  readonly deflection: A
  readonly force: B
  readonly temperature: C
  readonly distance: D
  readonly time: E
}

type HeavydynUnitsNames = keyof HeavydynUnitsSkeleton<any>

type PossibleHeavydynDeflectionUnits = 'mm' | '1/100 mm' | 'um'
type PossibleHeavydynForceUnits = 'N' | 'kN' | 'lbs'
type PossibleHeavydynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleHeavydynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleHeavydynTimeUnits = 's' | 'ms' | 'us'

type JSONHeavydynUnits = HeavydynUnitsSkeleton<
  JSONMathUnit<PossibleHeavydynDeflectionUnits>,
  JSONMathUnit<PossibleHeavydynForceUnits>,
  JSONMathUnit<PossibleHeavydynTemperatureUnits>,
  JSONMathUnit<PossibleHeavydynDistanceUnits>,
  JSONMathUnit<PossibleHeavydynTimeUnits>
>

type HeavydynMathUnits = HeavydynUnitsSkeleton<
  MathUnit<PossibleHeavydynDeflectionUnits>,
  MathUnit<PossibleHeavydynForceUnits>,
  MathUnit<PossibleHeavydynTemperatureUnits>,
  MathUnit<PossibleHeavydynDistanceUnits>,
  MathUnit<PossibleHeavydynTimeUnits>
>
