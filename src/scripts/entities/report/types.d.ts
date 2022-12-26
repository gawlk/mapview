// ---
// JSON
// ---

type JSONMachineReport =
  | JSONHeavydynReport
  | JSONMaxidynReport
  | JSONMinidynReport

type JSONMachineDataLabelsGroup =
  | JSONHeavydynDataLabelsGroup
  | JSONMaxidynDataLabelsGroup
  | JSONMinidynDataLabelsGroup

type JSONMachineDataLabelsGroups =
  | JSONHeavydynDataLabelsGroups
  | JSONMaxidynDataLabelsGroups
  | JSONMinidynDataLabelsGroups

// ---
// Object
// ---

type MachineReport = HeavydynReport | MaxidynReport | MinidynReport

// ---
// Parameters
// ---

interface MachineReportCreatorParameters {
  readonly project: MachineProject
}
