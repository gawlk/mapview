// ---
// JSON
// ---

type JSONDataLabelVAny<T extends String> = JSONDataLabel<T>

interface JSONDataLabel<T extends String> {
  readonly version: 1
  readonly name: string
  readonly unit: T
}

// ---
// Object
// ---

interface DataLabel<T> {
  readonly name: string
  readonly unit: MathUnit<T>
  readonly scientificName?: string
}
