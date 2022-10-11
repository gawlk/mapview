// ---
// JSON
// ---

type JSONMachineReport =
  | JSONHeavydynReport
  | JSONMaxidynReport
  | JSONMinidynReport

type JSONMachineGroupedDataLabels =
  | JSONHeavydynGroupedDataLabels
  | JSONMaxidynGroupedDataLabels
  | JSONMinidynGroupedDataLabels

// ---
// Object
// ---

type PartialMachineReport<MachineReport> = PartialExtendedObject<
  BaseReport,
  MachineReport
>

type MachineReport = HeavydynReport | MaxidynReport | MinidynReport

type MachineGroupedDataLabels =
  | HeavydynGroupedDataLabels
  | MaxidynGroupedDataLabels
  | MinidynGroupedDataLabels

type MachineDropIndex = HeavydynDropIndex | MaxidynDropIndex | MinidynDropIndex

type MachineThresholds =
  | HeavydynThresholds
  | MaxidynThresholds
  | MinidynThresholds

type MachineTableDataLabelsParameters =
  | HeavydynTableDataLabelsParameters
  | MaxidynTableDataLabelsParameters
  | MinidynTableDataLabelsParameters

type MachineReportDataLabels =
  | HeavydynReportDataLabels
  | MaxidynReportDataLabels
  | MinidynReportDataLabels

// ---
// Parameters
// ---

interface MachineReportCreatorParameters {
  project: MachineProject
}
