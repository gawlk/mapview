// ---
// JSON
// ---

type JSONDataLabelVAny<T extends string> = JSONDataLabel<T>

interface JSONDataLabel<T extends string> {
  readonly version: 1
  readonly name: string
  readonly unit: T
}

// ---
// Object
// ---

interface DataLabel<T extends string> {
  readonly name: string
  readonly unit: MathUnit<T>
  readonly toJSON: () => JSONDataLabel<T>
}
