interface MinidynProject extends BaseProject {
  readonly machine: 'Minidyn'
  readonly reports: SelectableList<MinidynReport>
}

interface MinidynMathUnitsSkeleton<A, B = A, C = A, D = A, E = A, F = A> {
  modulus: A
  stiffness: B
  deflection: C
  load: D
  temperature: E
  time: F
}

type MinidynMathUnits = MinidynMathUnitsSkeleton<MathUnit>

type PossibleMinidynModulusUnits = 'MPa'
type PossibleMinidynStiffnessUnits = 'MN / m'
type PossibleMinidynDeflectionUnits = 'mm' | 'um'
type PossibleMinidynForceUnits = 'N' | 'kN'
type PossibleMinidynTemperatureUnits = '°C' | '°F' | 'K'
type PossibleMinidynTimeUnits = 's' | 'ms' | 'us'

type JSONMinidynUnits = MinidynMathUnitsSkeleton<
  PossibleMinidynModulusUnits,
  PossibleMinidynStiffnessUnits,
  PossibleMinidynDeflectionUnits,
  PossibleMinidynForceUnits,
  PossibleMinidynTemperatureUnits,
  PossibleMinidynTimeUnits
>

type MinidynMathUnitsNames = keyof MinidynMathUnitsSkeleton<any>
