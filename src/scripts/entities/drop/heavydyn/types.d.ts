// ---
// JSON
// ---

type JSONHeavydynDropVAny = JSONHeavydynDrop

interface JSONHeavydynDrop {
  readonly version: 1
  readonly base: JSONBaseDrop
  readonly distinct: JSONHeavydynDropDistinct
}

interface JSONHeavydynDropDistinct {
  readonly version: 1
}

type JSONHeavydynDropIndexVAny = JSONHeavydynDropIndex

interface JSONHeavydynDropIndex {
  readonly version: 1
  readonly base: JSONBaseDropIndex
  readonly distinct: JSONHeavydynDropIndexDistinct
}

interface JSONHeavydynDropIndexDistinct {
  readonly version: 1
  readonly type: HeavydynDropType
  readonly value: number
  readonly unit: string
}

type HeavydynDropType = 'Distance' | 'Time' | 'Force' | 'Height'

// ---
// Object
// ---

interface HeavydynDrop extends BaseDrop {
  readonly index: HeavydynDropIndex
  readonly point: HeavydynPoint
  toJSON: () => JSONHeavydynDrop
}

interface HeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'Heavydyn'
  readonly type: HeavydynDropType
  readonly value: MathNumber
  readonly toJSON: () => JSONHeavydynDropIndex
}
