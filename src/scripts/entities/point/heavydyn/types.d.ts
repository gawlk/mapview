// ---
// JSON
// ---

type JSONHeavydynPointVAny = JSONHeavydynPoint

interface JSONHeavydynPoint {
  version: 1
  base: JSONBasePoint
  distinct: JSONHeavydynPointDistinct
}

interface JSONHeavydynPointDistinct {
  version: 1
}

// ---
// Object
// ---

interface HeavydynPoint extends BasePoint {
  readonly machine: 'Heavydyn'
  readonly drops: HeavydynDrop[]
  zone: HeavydynZone
  information: Field[]
  toJSON: () => JSONHeavydynPoint
}
