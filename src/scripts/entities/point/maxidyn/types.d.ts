// ---
// JSON
// ---

type JSONMaxidynPointVAny = JSONMaxidynPoint

interface JSONMaxidynPoint {
  version: 1
  base: JSONBasePoint
  distinct: JSONMaxidynPointDistinct
}

interface JSONMaxidynPointDistinct {
  version: 1
}

// ---
// Object
// ---

interface MaxidynPoint extends BasePoint {
  readonly machine: 'Maxidyn'
  readonly drops: MaxidynDrop[]
  zone: MaxidynZone
  information: Field[]
  toJSON: () => JSONMaxidynPoint
}
