type MachineReport = HeavydynReport | MaxidynReport | MinidynReport

type PartialMachineReport<MachineReport> = PartialExtendedObject<
  BaseReport,
  MachineReport
>

interface MachineReportCreatorParameters {
  projectSettings: JSONProjectSettings
  units: MachineUnits
  threshold: {
    colors: ThresholdColors
  }
}
