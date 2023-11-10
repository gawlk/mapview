// ---
// JSON
// ---

type JSONMaxidynZoneVAny = JSONMaxidynZone

interface JSONMaxidynZone {
  readonly version: 1
  readonly base: JSONBaseZone
  readonly distinct: JSONMaxidynZoneDistinct
}

interface JSONMaxidynZoneDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface MaxidynZone
  extends MaxidynObject<JSONMaxidynZone>,
    BaseZone<MaxidynPoint, MaxidynReport>,
    DisposableObject {}
