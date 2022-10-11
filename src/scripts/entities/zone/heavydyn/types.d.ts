// ---
// JSON
// ---

type JSONHeavydynZoneVAny = JSONHeavydynZone

interface JSONHeavydynZone {
  version: 1
  base: JSONBaseZone
  distinct: JSONHeavydynZoneDistinct
}

interface JSONHeavydynZoneDistinct {
  version: 1
}

// ---
// Object
// ---

interface HeavydynZone extends BaseZone {
  readonly machine: 'Heavydyn'
  readonly points: HeavydynPoint[]
}
