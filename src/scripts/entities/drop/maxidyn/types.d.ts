// ---
// JSON
// ---

type JSONMaxidynDropVAny = JSONMaxidynDrop

interface JSONMaxidynDrop {
  version: 1
  base: JSONBaseDrop
  distinct: JSONMaxidynDropDistinct
}

interface JSONMaxidynDropDistinct {
  version: 1
}

type JSONMaxidynDropIndexVAny = JSONMaxidynDropIndex

interface JSONMaxidynDropIndex {
  readonly version: 1
  base: JSONBaseDropIndex
  distinct: JSONMaxidynDropIndexDistinct
}

interface JSONMaxidynDropIndexDistinct {
  readonly version: 1
  readonly type: MaxidynDropType
}

type MaxidynDropType = 'Training' | 'Averaging'

// ---
// Object
// ---

interface MaxidynDrop extends BaseDrop {
  index: MaxidynDropIndex
  point: MaxidynPoint
  toJSON: () => JSONMaxidynDrop
}

interface MaxidynDropIndex extends BaseDropIndex {
  machine: 'Maxidyn'
  type: MaxidynDropType
}
