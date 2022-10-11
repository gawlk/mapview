// ---
// JSON
// ---

type JSONMinidynPointVAny = JSONMinidynPoint

interface JSONMinidynPoint {
  version: 1
  base: JSONBasePoint
  distinct: JSONMinidynPointDistinct
}

interface JSONMinidynPointDistinct {
  version: 1
}

// ---
// Object
// ---

interface MinidynPoint extends BasePoint {
  readonly machine: 'Minidyn'
  readonly drops: MinidynDrop[]
  zone: MinidynZone
  information: Field[]
  toJSON: () => JSONMinidynPoint
}
