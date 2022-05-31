interface MaxidynProject extends BaseProject {
  readonly machine: 'Maxidyn'
  readonly reports: SelectableList<MaxidynReport>
  readonly units: MaxidynMathUnits
  bearingParameters: JSONBearingParameters
}

interface JSONMaxidynProject extends JSONProject {
  bearingParameters: JSONBearingParameters
}

interface MaxidynMathUnitsSkeleton<
  A,
  B = A,
  C = A,
  D = A,
  E = A,
  F = A,
  G = A
> {
  modulus: A
  stiffness: B
  deflection: C
  force: D
  distance: E
  time: F
  percentage: G
}

type MaxidynMathUnits = MaxidynMathUnitsSkeleton<MathUnit>

type PossibleMaxidynModulusUnits = 'MPa'
type PossibleMaxidynStiffnessUnits = 'MN / m'
type PossibleMaxidynDeflectionUnits = 'mm' | 'um'
type PossibleMaxidynForceUnits = 'N' | 'kN'
type PossibleMaxidynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleMaxidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMaxidynPercentageUnits = '%'

type JSONMaxidynUnits = MaxidynMathUnitsSkeleton<
  PossibleMaxidynModulusUnits,
  PossibleMaxidynStiffnessUnits,
  PossibleMaxidynDeflectionUnits,
  PossibleMaxidynForceUnits,
  PossibleMaxidynDistanceUnits,
  PossibleMaxidynTimeUnits,
  PossibleMaxidynPercentageUnits
>

type MaxidynMathUnitsNames = keyof MaxidynMathUnitsSkeleton<any>
