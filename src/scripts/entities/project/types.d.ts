type MachineProject = HeavydynProject | MaxidynProject | MinidynProject

type PartialMachineProject<MachineProject> = PartialExtendedObject<
  BaseProject,
  MachineProject
>

type JSONMachineUnits = JSONHeavydynUnits | JSONMaxidynUnits | JSONMinidynUnits

type MachineMathUnits = HeavydynMathUnits | MaxidynMathUnits | MinidynMathUnits

type MachineMathUnitsSkeleton<T> =
  | HeavydynMathUnitsSkeleton<T>
  | MaxidynMathUnitsSkeleton<T>
  | MinidynMathUnitsSkeleton<T>

type MachineMathUnitsNames =
  | HeavydynMathUnitsNames
  | MaxidynMathUnitsNames
  | MinidynMathUnitsNames
