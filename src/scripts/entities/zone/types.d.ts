// ---
// JSON
// ---

type JSONMachineZone = JSONHeavydynZone | JSONMaxidynZone | JSONMinidynZone

// ---
// Object
// ---

type MachineZone = HeavydynZone | MaxidynZone | MinidynZone

type PartialMachineZone<MachineZone> = PartialExtendedObject<
  BaseZone,
  MachineZone
>

// ---
// Parameters
// ---

interface MachineZoneCreatorParameters {
  readonly report: MachineReport
}
