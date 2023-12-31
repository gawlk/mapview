interface MinidynUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A, G = A> {
  readonly modulus: A
  readonly stiffness: B
  readonly deflection: C
  readonly force: D
  readonly distance: E
  readonly time: F
  readonly percentage: G
}

type PossibleMinidynModulusUnits = 'MPa'
type PossibleMinidynStiffnessUnits = 'MN / m'
type PossibleMinidynDeflectionUnits = 'mm' | 'um'
type PossibleMinidynForceUnits = 'N' | 'kN'
type PossibleMinidynDistanceUnits = 'm' | 'km' | 'mi'
type PossibleMinidynTimeUnits = 's' | 'ms' | 'us'
type PossibleMinidynPercentageUnits = '%'

type JSONMinidynUnitsVAny = JSONMinidynUnits

type JSONMinidynUnits = { readonly version: 1 } & MinidynUnitsSkeleton<
  JSONMathUnit<PossibleMinidynModulusUnits>,
  JSONMathUnit<PossibleMinidynStiffnessUnits>,
  JSONMathUnit<PossibleMinidynDeflectionUnits>,
  JSONMathUnit<PossibleMinidynForceUnits>,
  JSONMathUnit<PossibleMinidynDistanceUnits>,
  JSONMathUnit<PossibleMinidynTimeUnits>,
  JSONMathUnit<PossibleMinidynPercentageUnits>
>

type MinidynMathUnits = MinidynUnitsSkeleton<
  MathUnit<PossibleMinidynModulusUnits>,
  MathUnit<PossibleMinidynStiffnessUnits>,
  MathUnit<PossibleMinidynDeflectionUnits>,
  MathUnit<PossibleMinidynForceUnits>,
  MathUnit<PossibleMinidynDistanceUnits>,
  MathUnit<PossibleMinidynTimeUnits>,
  MathUnit<PossibleMinidynPercentageUnits>
> & { list: MathUnit<string>[] } & SerializableObject<JSONMinidynUnits>

type MinidynUnitsNames = keyof MinidynUnitsSkeleton<undefined>
