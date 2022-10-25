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

type MachineReportThresholds =
  | HeavydynReportThresholds
  | MaxidynReportThresholds
  | MinidynReportThresholds

type MachineReportThresholdsGroups =
  | HeavydynReportThresholdsGroups
  | MaxidynReportThresholdsGroups
  | MinidynReportThresholdsGroups

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
  readonly project: MachineProject
}
