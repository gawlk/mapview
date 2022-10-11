// ---
// JSON
// ---

type JSONDataValueVAny = JSONDataValue

interface JSONDataValue {
  version: 1
  label: string
  value: number
}

// ---
// Object
// ---

interface DataValue<T> {
  readonly label: DataLabel<T>
  value: MathNumber
  toJSON: () => JSONDataValue
}
