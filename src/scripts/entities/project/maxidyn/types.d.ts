interface MaxidynProject extends BaseProject {
  readonly machine: 'Maxidyn'
  readonly reports: SelectableList<MaxidynReport>
  readonly units: MaxidynMathUnits
}

interface MaxidynMathUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A> {
  modulus: A
  stiffness: B
  deflection: C
  load: D
  distance: E
  time: F
}

type MaxidynMathUnits = MaxidynMathUnitsSkeleton<MathUnit>

type PossibleMaxidynModulusUnits = 'MPa'
type PossibleMaxidynStiffnessUnits = 'MN / m'
type PossibleMaxidynDeflectionUnits = 'mm' | 'um'
type PossibleMaxidynForceUnits = 'N' | 'kN'
type PossibleMaxidynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleMaxidynTimeUnits = 's' | 'ms' | 'us'

type JSONMaxidynUnits = MaxidynMathUnitsSkeleton<
  PossibleMaxidynModulusUnits,
  PossibleMaxidynStiffnessUnits,
  PossibleMaxidynDeflectionUnits,
  PossibleMaxidynForceUnits,
  PossibleMaxidynDistanceUnits,
  PossibleMaxidynTimeUnits
>

type MaxidynMathUnitsNames = keyof MaxidynMathUnitsSkeleton<any>
