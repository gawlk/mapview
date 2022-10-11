// ---
// JSON
// ---

type JSONMinidynZoneVAny = JSONMinidynZone

interface JSONMinidynZone {
  version: 1
  base: JSONBaseZone
  distinct: JSONMinidynZoneDistinct
}

interface JSONMinidynZoneDistinct {
  version: 1
}

// ---
// Object
// ---

interface MinidynZone extends BaseZone {
  readonly machine: 'Minidyn'
  readonly points: MinidynPoint[]
}
