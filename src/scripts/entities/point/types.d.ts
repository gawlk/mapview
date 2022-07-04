type MachinePoint = HeavydynPoint | MaxidynPoint | MinidynPoint

type PartialMachinePoint<MachinePoint> = PartialExtendedObject<
  BasePoint,
  MachinePoint
>

interface MachinePointCreatorParameters {
  zone: MachineZone
}