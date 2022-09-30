type JSONMachineDropIndex =
  | JSONHeavydynDropIndex
  | JSONMaxidynDropIndex
  | JSONMinidynDropIndex

type MachineDrop = HeavydynDrop | MaxidynDrop | MinidynDrop

type PartialMachineDrop<MachineDrop> = PartialExtendedObject<
  BaseDrop,
  MachineDrop
>

interface MachineDropCreatorParameters {
  point: MachinePoint
}
