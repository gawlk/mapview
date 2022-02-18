type MachineProject = HeavydynProject | MaxidynProject | MinidynProject

type PartialMachineProject<MachineProject> = PartialExtendedObject<
  BaseProject,
  MachineProject
>

type JSONUnits = JSONHeavydynUnits | JSONMaxidynUnits | JSONMinidynUnits

type MachineUnits = HeavydynUnits | MaxidynUnits | MinidynUnits
