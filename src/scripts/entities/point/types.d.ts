type MachinePoint = HeavydynPoint | MaxidynPoint | MinidynPoint

type PartialMachinePoint<MachinePoint> = PartialExtendedObject<
  BasePoint,
  MachinePoint
>

interface MachinePointCreatorParameters {
  projectSettings: JSONProjectSettings
  reportSettings: JSONReportSettings
  reportDataLabels: ReportDataLabels
  reportThresholds: ReportThresholds
  zoneSettings: JSONZoneSettings
}
