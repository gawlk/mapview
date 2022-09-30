// ---
// JSON
// ---

// ---
// Object
// ---

interface MaxidynZone extends BaseZone {
  readonly machine: 'Maxidyn'
  readonly points: MaxidynPoint[]
}

interface MaxidynZoneCreatorParameters extends MachineZoneCreatorParameters {}
