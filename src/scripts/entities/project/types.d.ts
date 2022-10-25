// ---
// JSON
// ---

type JSONMachineProject =
  | JSONHeavydynProject
  | JSONMaxidynProject
  | JSONMinidynProject

interface JSONBearingParameters {
  readonly version: 1
  readonly min: number
  readonly max: number
}

// ---
// Object
// ---

type MachineProject = HeavydynProject | MaxidynProject | MinidynProject

type PartialMachineProject<MachineProject> = PartialExtendedObject<
  BaseProject,
  MachineProject
>

type MachineMathUnits = HeavydynMathUnits | MaxidynMathUnits | MinidynMathUnits

type MachineUnitsSkeleton<T> =
  | HeavydynUnitsSkeleton<T>
  | MaxidynUnitsSkeleton<T>
  | MinidynUnitsSkeleton<T>

type MachineUnitsNames =
  | HeavydynUnitsNames
  | MaxidynUnitsNames
  | MinidynUnitsNames
