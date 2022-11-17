// ---
// JSON
// ---

type JSONMinidynPointVAny = JSONMinidynPoint

interface JSONMinidynPoint {
  readonly version: 1
  readonly base: JSONBasePoint
  readonly distinct: JSONMinidynPointDistinct
}

interface JSONMinidynPointDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface MinidynPoint extends BasePoint {
  readonly machine: 'Minidyn'
  readonly drops: MinidynDrop[]
  zone: MinidynZone
  toJSON: () => JSONMinidynPoint
}
