type MachineZone = HeavydynZone | MaxidynZone | MinidynZone

type PartialMachineZone<MachineZone> = PartialExtendedObject<
  BaseZone,
  MachineZone
>

interface MachineZoneCreatorParameters {
  projectSettings: JSONProjectSettings
  reportSettings: JSONReportSettings
  reportDataLabels: ReportDataLabels
  reportThresholds: ReportThresholds
}
