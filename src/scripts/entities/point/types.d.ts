type MachinePoint = HeavydynPoint | MaxidynPoint | MinidynPoint

type PartialMachinePoint<MachinePoint> = PartialExtendedObject<
  BasePoint,
  MachinePoint
>

interface MachinePointCreatorParameters {
  number: number
  iconName: IconName
  projectSettings: JSONProjectSettings
  reportSettings: JSONReportSettings
  // rawData: MathNumberObject
  // parametersData: MathNumberObject
}
