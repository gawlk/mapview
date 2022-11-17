// ---
// JSON
// ---

type JSONHeavydynZoneVAny = JSONHeavydynZone

interface JSONHeavydynZone {
  readonly version: 1
  readonly base: JSONBaseZone
  readonly distinct: JSONHeavydynZoneDistinct
}

interface JSONHeavydynZoneDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface HeavydynZone extends BaseZone {
  readonly machine: 'Heavydyn'
  readonly points: HeavydynPoint[]
  toJSON: () => JSONHeavydynZone
}
