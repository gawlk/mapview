// ---
// JSON
// ---

type JSONBaseDropVAny = JSONBaseDrop

interface JSONBaseDrop {
  readonly version: 1
  readonly index: number
  readonly data: JSONDataValue[]
}

type JSONBaseDropIndexVAny = JSONBaseDropIndex

interface JSONBaseDropIndex {
  readonly version: 1
  readonly displayedIndex: number
}

// ---
// Object
// ---

interface BaseDrop<
  DropIndex extends BaseDropIndex = MachineDropIndex,
  Point extends BasePoint = MachinePoint
> extends BaseObject<JSONBaseDrop> {
  readonly index: DropIndex
  readonly data: DataValue<string>[]
  readonly point: Point
  impactData: ImpactData | null
}

interface BaseDropIndex extends BaseObject<JSONBaseDropIndex> {
  readonly displayedIndex: number
}
