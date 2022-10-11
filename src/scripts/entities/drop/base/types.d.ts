// ---
// JSON
// ---

type JSONBaseDropVAny = JSONBaseDrop

interface JSONBaseDrop {
  version: 1
  index: number
  data: JSONDataValue[]
}

type JSONBaseDropIndexVAny = JSONBaseDropIndex

interface JSONBaseDropIndex {
  version: 1
  readonly displayedIndex: number
}

// ---
// Object
// ---

interface BaseDrop {
  index: MachineDropIndex
  data: DataValue<string>[]
  additionalFields: Field[]
  point: MachinePoint
  impactData: ImpactData | null
  toBaseJSON: () => JSONBaseDrop
}

interface BaseDropIndex {
  readonly displayedIndex: number
}
