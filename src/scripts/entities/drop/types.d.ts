// ---
// JSON
// ---

type JSONMachineDropIndex =
  | JSONHeavydynDropIndex
  | JSONMaxidynDropIndex
  | JSONMinidynDropIndex

type JSONMachineDrop = JSONHeavydynDrop | JSONMaxidynDrop | JSONMinidynDrop

// ---
// Object
// ---

type MachineDrop = HeavydynDrop | MaxidynDrop | MinidynDrop

type PartialMachineDrop<MachineDrop> = PartialExtendedObject<
  BaseDrop,
  MachineDrop
>

// ---
// Parameters
// ---

interface MachineDropCreatorParameters {
  point: MachinePoint
}
