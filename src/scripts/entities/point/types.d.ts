// ---
// JSON
// ---

type JSONMachinePoint = JSONHeavydynPoint | JSONMaxidynPoint | JSONMinidynPoint

// ---
// Object
// ---

type MachinePoint = HeavydynPoint | MaxidynPoint | MinidynPoint

type PartialMachinePoint<MachinePoint> = PartialExtendedObject<
  BasePoint,
  MachinePoint
>

// ---
// Parameters
// ---

interface MachinePointCreatorParameters {
  readonly zone: MachineZone
}
