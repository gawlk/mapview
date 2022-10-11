// ---
// JSON
// ---

type JSONHeavydynDropVAny = JSONHeavydynDrop

interface JSONHeavydynDrop {
  version: 1
  base: JSONBaseDrop
  distinct: JSONHeavydynDropDistinct
}

interface JSONHeavydynDropDistinct {
  version: 1
}

type JSONHeavydynDropIndexVAny = JSONHeavydynDropIndex

interface JSONHeavydynDropIndex {
  readonly version: 1
  base: JSONBaseDropIndex
  distinct: JSONHeavydynDropIndexDistinct
}

interface JSONHeavydynDropIndexDistinct {
  readonly version: 1
  readonly type: HeavydynDropType
  value: number
  readonly unit: string
}

type HeavydynDropType = 'Distance' | 'Time' | 'Force' | 'Height'

// ---
// Object
// ---

interface HeavydynDrop extends BaseDrop {
  index: HeavydynDropIndex
  point: HeavydynPoint
  toJSON: () => JSONHeavydynDrop
}

interface HeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'Heavydyn'
  readonly type: HeavydynDropType
  value: MathNumber
}
