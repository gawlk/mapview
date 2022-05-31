interface MinidynProject extends BaseProject {
  readonly machine: 'Minidyn'
  readonly reports: SelectableList<MinidynReport>
  readonly units: MinidynMathUnits
  bearingParameters: JSONBearingParameters
}

interface JSONMinidynProject extends JSONProject {
  bearingParameters: JSONBearingParameters
}

interface MinidynMathUnitsSkeleton<
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
  temperature: E
  time: F
  percentage: G
}

type MinidynMathUnits = MinidynMathUnitsSkeleton<MathUnit>

type PossibleMinidynModulusUnits = 'MPa'
type PossibleMinidynStiffnessUnits = 'MN / m'
type PossibleMinidynDeflectionUnits = 'mm' | 'um'
type PossibleMinidynForceUnits = 'N' | 'kN'
type PossibleMinidynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleMinidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMinidynPercentageUnits = '%'

type JSONMinidynUnits = MinidynMathUnitsSkeleton<
  PossibleMinidynModulusUnits,
  PossibleMinidynStiffnessUnits,
  PossibleMinidynDeflectionUnits,
  PossibleMinidynForceUnits,
  PossibleMinidynTemperatureUnits,
  PossibleMinidynTimeUnits,
  PossibleMinidynPercentageUnits
>

type MinidynMathUnitsNames = keyof MinidynMathUnitsSkeleton<any>
