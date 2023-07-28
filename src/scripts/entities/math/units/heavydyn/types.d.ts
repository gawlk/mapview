interface HeavydynUnitsSkeleton<
  A,
  B = A,
  C = A,
  D = A,
  E = A,
  F = A,
  G = A,
  H = A
> {
  readonly deflection: A
  readonly force: B
  readonly temperature: C
  readonly distance: D
  readonly time: E
  readonly modulus: F
  readonly cumSum: G
  readonly radius: H
}

interface HeavydynUnitsSkeletonV1<A, B = A, C = A, D = A, E = A, F = A, G = A> {
  readonly deflection: A
  readonly force: B
  readonly temperature: C
  readonly distance: D
  readonly time: E
  readonly modulus: F
  readonly cumSum: G
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HeavydynUnitsNames = keyof HeavydynUnitsSkeleton<any>

type PossibleHeavydynDeflectionUnits = 'mm' | '1/100 mm' | 'um'
type PossibleHeavydynForceUnits = 'N' | 'kN' | 'lbs'
type PossibleHeavydynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleHeavydynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleHeavydynTimeUnits = 's' | 'ms' | 'us'
type PossibleHeavydynModulusUnits = 'MPa'
type PossibleHeavydynRadiusUnits = 'm' | 'km' | 'mi'

type JSONHeavydynUnitsVAny = JSONHeavydynUnits | JSONHeavydynUnitsV1

type JSONHeavydynUnits = { version: 2 } & HeavydynUnitsSkeleton<
  JSONMathUnit<PossibleHeavydynDeflectionUnits>,
  JSONMathUnit<PossibleHeavydynForceUnits>,
  JSONMathUnit<PossibleHeavydynTemperatureUnits>,
  JSONMathUnit<PossibleHeavydynDistanceUnits>,
  JSONMathUnit<PossibleHeavydynTimeUnits>,
  JSONMathUnit<PossibleHeavydynModulusUnits>,
  JSONMathUnit<''>,
  JSONMathUnit<PossibleHeavydynRadiusUnits>
>

type JSONHeavydynUnitsV1 = { version: 1 } & HeavydynUnitsSkeletonV1<
  JSONMathUnit<PossibleHeavydynDeflectionUnits>,
  JSONMathUnit<PossibleHeavydynForceUnits>,
  JSONMathUnit<PossibleHeavydynTemperatureUnits>,
  JSONMathUnit<PossibleHeavydynDistanceUnits>,
  JSONMathUnit<PossibleHeavydynTimeUnits>,
  JSONMathUnit<PossibleHeavydynModulusUnits>,
  JSONMathUnit<''>
>

type HeavydynMathUnits = HeavydynUnitsSkeleton<
  MathUnit<PossibleHeavydynDeflectionUnits>,
  MathUnit<PossibleHeavydynForceUnits>,
  MathUnit<PossibleHeavydynTemperatureUnits>,
  MathUnit<PossibleHeavydynDistanceUnits>,
  MathUnit<PossibleHeavydynTimeUnits>,
  MathUnit<PossibleHeavydynModulusUnits>,
  MathUnit<''>,
  MathUnit<PossibleHeavydynRadiusUnits>
>
