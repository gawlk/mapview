// ---
// JSON
// ---

type JSONMaxidynDropVAny = JSONMaxidynDrop

interface JSONMaxidynDrop {
  readonly version: 1
  readonly base: JSONBaseDrop
  readonly distinct: JSONMaxidynDropDistinct
}

interface JSONMaxidynDropDistinct {
  readonly version: 1
}

type JSONMaxidynDropIndexVAny = JSONMaxidynDropIndex

interface JSONMaxidynDropIndex {
  readonly version: 1
  readonly base: JSONBaseDropIndex
  readonly distinct: JSONMaxidynDropIndexDistinct
}

interface JSONMaxidynDropIndexDistinct {
  readonly version: 1
  readonly type: MaxidynDropType
}

type MaxidynDropType = 'Training' | 'Averaging'

// ---
// Object
// ---

interface MaxidynDrop
  extends MaxidynObject<JSONMaxidynDrop>,
    BaseDrop<MaxidynDropIndex, MaxidynPoint> {}

interface MaxidynDropIndex
  extends MaxidynObject<JSONMaxidynDropIndex>,
    BaseDropIndex {
  readonly type: MaxidynDropType
}
