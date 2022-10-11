// ---
// JSON
// ---

type JSONMinidynDropVAny = JSONMinidynDrop

interface JSONMinidynDrop {
  version: 1
  base: JSONBaseDrop
  distinct: JSONMinidynDropDistinct
}

interface JSONMinidynDropDistinct {
  version: 1
}

type JSONMinidynDropIndexVAny = JSONMinidynDropIndex

interface JSONMinidynDropIndex {
  version: 1
  base: JSONBaseDropIndex
  distinct: JSONMinidynDropIndexDistinct
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
  index: MinidynDropIndex
  point: MinidynPoint
  toJSON: () => JSONMinidynDrop
}

interface MinidynDropIndex extends BaseDropIndex {
  machine: 'Minidyn'
  type: MinidynDropType
}
