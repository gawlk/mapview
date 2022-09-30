// ---
// JSON
// ---

// ---
// Object
// ---

interface HeavydynZone extends BaseZone {
  readonly machine: 'Heavydyn'
  readonly points: HeavydynPoint[]
}

interface HeavydynZoneCreatorParameters extends MachineZoneCreatorParameters {}
