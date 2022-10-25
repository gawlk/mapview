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

interface MaxidynDrop extends BaseDrop {
  readonly index: MaxidynDropIndex
  readonly point: MaxidynPoint
  toJSON: () => JSONMaxidynDrop
}

interface MaxidynDropIndex extends BaseDropIndex {
  readonly machine: 'Maxidyn'
  readonly type: MaxidynDropType
  readonly toJSON: () => JSONMaxidynDropIndex
}
