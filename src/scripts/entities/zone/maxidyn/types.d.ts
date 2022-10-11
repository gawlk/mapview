// ---
// JSON
// ---

type JSONMaxidynZoneVAny = JSONMaxidynZone

interface JSONMaxidynZone {
  version: 1
  base: JSONBaseZone
  distinct: JSONMaxidynZoneDistinct
}

interface JSONMaxidynZoneDistinct {
  version: 1
}

// ---
// Object
// ---

interface MaxidynZone extends BaseZone {
  readonly machine: 'Maxidyn'
  readonly points: MaxidynPoint[]
}
