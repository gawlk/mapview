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

interface MaxidynPoint
  extends MaxidynObject<JSONMaxidynPoint>,
    BasePoint<MaxidynDrop, MaxidynZone> {}
