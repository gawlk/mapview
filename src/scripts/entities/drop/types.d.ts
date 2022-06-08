type MachineDrop = HeavydynDrop | MaxidynDrop | MinidynDrop

type PartialMachineDrop<MachineDrop> = PartialExtendedObject<
  BaseDrop,
  MachineDrop
>

interface MachineDropCreatorParameters {
  point: MachinePoint
}
