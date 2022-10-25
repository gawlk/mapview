// ---
// JSON
// ---

type JSONMinidynDropVAny = JSONMinidynDrop

interface JSONMinidynDrop {
  readonly version: 1
  readonly base: JSONBaseDrop
  readonly distinct: JSONMinidynDropDistinct
}

interface JSONMinidynDropDistinct {
  readonly version: 1
}

type JSONMinidynDropIndexVAny = JSONMinidynDropIndex

interface JSONMinidynDropIndex {
  readonly version: 1
  readonly base: JSONBaseDropIndex
  readonly distinct: JSONMinidynDropIndexDistinct
}

interface JSONMinidynDropIndexDistinct {
  readonly version: 1
  readonly type: MinidynDropType
}

type MinidynDropType = 'Training' | 'Averaging'

// ---
// Object
// ---

interface MinidynDrop extends BaseDrop {
  readonly index: MinidynDropIndex
  readonly point: MinidynPoint
  toJSON: () => JSONMinidynDrop
}

interface MinidynDropIndex extends BaseDropIndex {
  readonly machine: 'Minidyn'
  readonly type: MinidynDropType
  readonly toJSON: () => JSONMinidynDropIndex
}
