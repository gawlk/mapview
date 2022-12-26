// ---
// JSON
// ---

type JSONMachineZone = JSONHeavydynZone | JSONMaxidynZone | JSONMinidynZone

// ---
// Object
// ---

type MachineZone = HeavydynZone | MaxidynZone | MinidynZone

// ---
// Parameters
// ---

interface MachineZoneCreatorParameters {
  readonly report: MachineReport
}
