// ---
// JSON
// ---

type JSONMaxidynPointVAny = JSONMaxidynPoint

interface JSONMaxidynPoint {
  readonly version: 1
  readonly base: JSONBasePoint
  readonly distinct: JSONMaxidynPointDistinct
}

interface JSONMaxidynPointDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface MaxidynPoint extends BasePoint {
  readonly machine: 'Maxidyn'
  readonly drops: MaxidynDrop[]
  zone: MaxidynZone
  toJSON: () => JSONMaxidynPoint
}
