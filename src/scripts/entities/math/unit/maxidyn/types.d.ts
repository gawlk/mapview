interface MaxidynUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A, G = A> {
  modulus: A
  stiffness: B
  deflection: C
  force: D
  distance: E
  time: F
  percentage: G
}

type PossibleMaxidynModulusUnits = 'MPa'
type PossibleMaxidynStiffnessUnits = 'MN / m'
type PossibleMaxidynDeflectionUnits = 'mm' | 'um'
type PossibleMaxidynForceUnits = 'N' | 'kN'
type PossibleMaxidynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleMaxidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMaxidynPercentageUnits = '%'

type JSONMaxidynUnits = MaxidynUnitsSkeleton<
  PossibleMaxidynModulusUnits,
  PossibleMaxidynStiffnessUnits,
  PossibleMaxidynDeflectionUnits,
  PossibleMaxidynForceUnits,
  PossibleMaxidynDistanceUnits,
  PossibleMaxidynTimeUnits,
  PossibleMaxidynPercentageUnits
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
