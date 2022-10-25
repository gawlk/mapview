// ---
// JSON
// ---

type JSONMaxidynZoneVAny = JSONMaxidynZone

interface JSONMaxidynZone {
  readonly version: 1
  readonly base: JSONBaseZone
  readonly distinct: JSONMaxidynZoneDistinct
}

interface JSONMaxidynZoneDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface MaxidynZone extends BaseZone {
  readonly machine: 'Maxidyn'
  readonly points: MaxidynPoint[]
  toJSON: () => JSONMaxidynZone
}
