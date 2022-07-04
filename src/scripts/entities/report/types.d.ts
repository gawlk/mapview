type MachineReport = HeavydynReport | MaxidynReport | MinidynReport

type PartialMachineReport<MachineReport> = PartialExtendedObject<
  BaseReport,
  MachineReport
>

interface MachineReportCreatorParameters {
  project: MachineProject
}

type MachineDropIndex = HeavydynDropIndex | MaxidynDropIndex | MinidynDropIndex

type MachineThresholds =
  | HeavydynThresholds
  | MaxidynThresholds
  | MinidynThresholds

type JSONMachineDropIndex =
  | JSONHeavydynDropIndex
  | MaxidynDropIndex
  | MinidynDropIndex