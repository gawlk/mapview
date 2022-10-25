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

interface DataValue<T> {
  readonly label: DataLabel<T>
  readonly value: MathNumber
  readonly toJSON: () => JSONDataValue
}
