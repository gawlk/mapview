// ---
// JSON
// ---

interface JSONDataValue {
  label: string
  value: number
}

// ---
// Object
// ---

interface DataValue<T> {
  readonly label: DataLabel<T>
  value: MathNumber
}
