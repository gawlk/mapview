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

interface MinidynDrop
  extends MinidynObject<JSONMinidynDrop>,
    BaseDrop<MinidynDropIndex, MinidynPoint> {}

interface MinidynDropIndex
  extends MinidynObject<JSONMinidynDropIndex>,
    BaseDropIndex {
  readonly type: MinidynDropType
}
