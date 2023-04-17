interface MaxidynUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A, G = A> {
  readonly modulus: A
  readonly stiffness: B
  readonly deflection: C
  readonly force: D
  readonly distance: E
  readonly time: F
  readonly percentage: G
}

type PossibleMaxidynModulusUnits = 'MPa'
type PossibleMaxidynStiffnessUnits = 'MN / m'
type PossibleMaxidynDeflectionUnits = 'mm' | 'um'
type PossibleMaxidynForceUnits = 'N' | 'kN'
type PossibleMaxidynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleMaxidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMaxidynPercentageUnits = '%'

type JSONMaxidynUnitsVAny = JSONMaxidynUnits

type JSONMaxidynUnits = { version: 1 } & MaxidynUnitsSkeleton<
  JSONMathUnit<PossibleMaxidynModulusUnits>,
  JSONMathUnit<PossibleMaxidynStiffnessUnits>,
  JSONMathUnit<PossibleMaxidynDeflectionUnits>,
  JSONMathUnit<PossibleMaxidynForceUnits>,
  JSONMathUnit<PossibleMaxidynDistanceUnits>,
  JSONMathUnit<PossibleMaxidynTimeUnits>,
  JSONMathUnit<PossibleMaxidynPercentageUnits>
>

type MaxidynMathUnits = MaxidynUnitsSkeleton<
  MathUnit<PossibleMaxidynModulusUnits>,
  MathUnit<PossibleMaxidynStiffnessUnits>,
  MathUnit<PossibleMaxidynDeflectionUnits>,
  MathUnit<PossibleMaxidynForceUnits>,
  MathUnit<PossibleMaxidynDistanceUnits>,
  MathUnit<PossibleMaxidynTimeUnits>,
  MathUnit<PossibleMaxidynPercentageUnits>
>

type MaxidynUnitsNames = keyof MaxidynUnitsSkeleton<any>
