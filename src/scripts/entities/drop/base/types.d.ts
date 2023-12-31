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
  Point extends BasePoint = MachinePoint,
> extends BaseObject<JSONBaseDrop> {
  readonly index: DropIndex
  readonly dataset: ReactiveMap<DataLabel, DataValue<string>>
  readonly point: Point
  readonly impactData: ASS<ImpactData | null>
}

interface BaseDropIndex extends BaseObject<JSONBaseDropIndex> {
  readonly displayedIndex: number
}
