interface MinidynUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A> {
  readonly modulus: A
  readonly stiffness: B
  readonly deflection: C
  readonly force: D
  readonly time: E
  readonly percentage: F
}

type PossibleMinidynModulusUnits = 'MPa'
type PossibleMinidynStiffnessUnits = 'MN / m'
type PossibleMinidynDeflectionUnits = 'mm' | 'um'
type PossibleMinidynForceUnits = 'N' | 'kN'
type PossibleMinidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMinidynPercentageUnits = '%'

type JSONMinidynUnits = MinidynUnitsSkeleton<
  JSONMathUnit<PossibleMinidynModulusUnits>,
  JSONMathUnit<PossibleMinidynStiffnessUnits>,
  JSONMathUnit<PossibleMinidynDeflectionUnits>,
  JSONMathUnit<PossibleMinidynForceUnits>,
  JSONMathUnit<PossibleMinidynTimeUnits>,
  JSONMathUnit<PossibleMinidynPercentageUnits>
>

type MinidynMathUnits = MinidynUnitsSkeleton<
  MathUnit<PossibleMinidynModulusUnits>,
  MathUnit<PossibleMinidynStiffnessUnits>,
  MathUnit<PossibleMinidynDeflectionUnits>,
  MathUnit<PossibleMinidynForceUnits>,
  MathUnit<PossibleMinidynTimeUnits>,
  MathUnit<PossibleMinidynPercentageUnits>
>

type MinidynUnitsNames = keyof MinidynUnitsSkeleton<any>
