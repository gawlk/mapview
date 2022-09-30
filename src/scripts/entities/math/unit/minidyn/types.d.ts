interface MinidynUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A, G = A> {
  modulus: A
  stiffness: B
  deflection: C
  force: D
  temperature: E
  time: F
  percentage: G
}

type PossibleMinidynModulusUnits = 'MPa'
type PossibleMinidynStiffnessUnits = 'MN / m'
type PossibleMinidynDeflectionUnits = 'mm' | 'um'
type PossibleMinidynForceUnits = 'N' | 'kN'
type PossibleMinidynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleMinidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMinidynPercentageUnits = '%'

type JSONMinidynUnits = MinidynUnitsSkeleton<
  PossibleMinidynModulusUnits,
  PossibleMinidynStiffnessUnits,
  PossibleMinidynDeflectionUnits,
  PossibleMinidynForceUnits,
  PossibleMinidynTemperatureUnits,
  PossibleMinidynTimeUnits,
  PossibleMinidynPercentageUnits
>

type MinidynMathUnits = MinidynUnitsSkeleton<
  MathUnit<PossibleMinidynModulusUnits>,
  MathUnit<PossibleMinidynStiffnessUnits>,
  MathUnit<PossibleMinidynDeflectionUnits>,
  MathUnit<PossibleMinidynForceUnits>,
  MathUnit<PossibleMinidynTemperatureUnits>,
  MathUnit<PossibleMinidynTimeUnits>,
  MathUnit<PossibleMinidynPercentageUnits>
>

type MinidynUnitsNames = keyof MinidynUnitsSkeleton<any>
