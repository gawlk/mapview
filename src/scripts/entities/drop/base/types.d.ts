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

interface BaseDrop {
  readonly index: MachineDropIndex
  readonly data: DataValue<string>[]
  readonly additionalFields: Field[]
  readonly point: MachinePoint
  impactData: ImpactData | null
  readonly toBaseJSON: () => JSONBaseDrop
}

interface BaseDropIndex {
  readonly displayedIndex: number
  readonly toBaseJSON: () => JSONBaseDropIndex
}
