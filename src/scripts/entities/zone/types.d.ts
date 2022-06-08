type MachineZone = HeavydynZone | MaxidynZone | MinidynZone

type PartialMachineZone<MachineZone> = PartialExtendedObject<
  BaseZone,
  MachineZone
>

interface MachineZoneCreatorParameters {
  report: MachineReport
}
