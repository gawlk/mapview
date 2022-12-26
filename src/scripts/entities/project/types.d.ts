// ---
// JSON
// ---

type JSONMachineProject =
  | JSONHeavydynProject
  | JSONMaxidynProject
  | JSONMinidynProject

interface JSONBearingParameters {
  readonly version: 1
  readonly name: string
  readonly algoBearing: string
  readonly hasQuality: boolean
  readonly algoProcessing1: string
  readonly algoProcessing2: string
  readonly dPlate: number
  readonly cPoisson: number
  readonly fForme: number
  readonly k: number
  readonly alpha: number
}

// ---
// Object
// ---

type MachineProject = HeavydynProject | MaxidynProject | MinidynProject

type MachineMathUnits = HeavydynMathUnits | MaxidynMathUnits | MinidynMathUnits

type MachineUnitsSkeleton<T> =
  | HeavydynUnitsSkeleton<T>
  | MaxidynUnitsSkeleton<T>
  | MinidynUnitsSkeleton<T>

type MachineUnitsNames =
  | HeavydynUnitsNames
  | MaxidynUnitsNames
  | MinidynUnitsNames
