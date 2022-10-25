interface MinidynUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A, G = A> {
  readonly modulus: A
  readonly stiffness: B
  readonly deflection: C
  readonly force: D
  readonly temperature: E
  readonly time: F
  readonly percentage: G
}

type PossibleMinidynModulusUnits = 'MPa'
type PossibleMinidynStiffnessUnits = 'MN / m'
type PossibleMinidynDeflectionUnits = 'mm' | 'um'
type PossibleMinidynForceUnits = 'N' | 'kN'
type PossibleMinidynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleMinidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMinidynPercentageUnits = '%'

type JSONMinidynUnits = MinidynUnitsSkeleton<
  JSONMathUnit<PossibleMinidynModulusUnits>,
  JSONMathUnit<PossibleMinidynStiffnessUnits>,
  JSONMathUnit<PossibleMinidynDeflectionUnits>,
  JSONMathUnit<PossibleMinidynForceUnits>,
  JSONMathUnit<PossibleMinidynTemperatureUnits>,
  JSONMathUnit<PossibleMinidynTimeUnits>,
  JSONMathUnit<PossibleMinidynPercentageUnits>
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
