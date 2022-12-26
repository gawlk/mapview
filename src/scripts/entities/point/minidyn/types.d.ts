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

interface MinidynPoint
  extends MinidynObject<JSONMinidynPoint>,
    BasePoint<MinidynDrop, MinidynZone> {}
