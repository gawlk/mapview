// ---
// JSON
// ---

type JSONDataValueVAny = JSONDataValue

interface JSONDataValue {
  readonly version: 1
  readonly label: string
  readonly value: number
}

// ---
// Object
// ---

interface DataValue<T extends string> {
  readonly label: DataLabel<T>
  readonly value: MathNumber
  getRawValue(): number
  toJSON: () => JSONDataValue
  toExcel: () => number | null
}
