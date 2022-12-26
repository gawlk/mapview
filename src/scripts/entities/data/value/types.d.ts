// ---
// JSON
// ---

type JSONDataValueVAny = JSONDataValue

interface JSONDataValue {
  readonly version: 1
  readonly category: string
  readonly label: string
  readonly value: number
}

// ---
// Object
// ---

interface DataValue<T extends string> {
  readonly category: string
  readonly label: DataLabel<T>
  readonly value: MathNumber
  readonly toJSON: () => JSONDataValue
}
