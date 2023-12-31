// ---
// JSON
// ---

type JSONHeavydynPointVAny = JSONHeavydynPoint

interface JSONHeavydynPoint {
  readonly version: 1
  readonly base: JSONBasePoint
  readonly distinct: JSONHeavydynPointDistinct
}

interface JSONHeavydynPointDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface HeavydynPoint
  extends HeavydynObject<JSONHeavydynPoint>,
    BasePoint<HeavydynDrop, HeavydynZone> {}
