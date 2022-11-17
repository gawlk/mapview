// ---
// JSON
// ---

type JSONMinidynZoneVAny = JSONMinidynZone

interface JSONMinidynZone {
  readonly version: 1
  readonly base: JSONBaseZone
  readonly distinct: JSONMinidynZoneDistinct
}

interface JSONMinidynZoneDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface MinidynZone extends BaseZone {
  readonly machine: 'Minidyn'
  readonly points: MinidynPoint[]
  toJSON: () => JSONMinidynZone
}
