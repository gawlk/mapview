// ---
// JSON
// ---

type JSONHeavydynZoneVAny = JSONHeavydynZone

interface JSONHeavydynZone {
  readonly version: 1
  readonly base: JSONBaseZone
  readonly distinct: JSONHeavydynZoneDistinct
}

interface JSONHeavydynZoneDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface HeavydynZone
  extends HeavydynObject<JSONHeavydynZone>,
    BaseZone<HeavydynPoint, HeavydynReport>,
    DisposableObject {}
