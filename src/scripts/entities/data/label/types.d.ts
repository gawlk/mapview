// ---
// JSON
// ---

type JSONDataLabelVAny<T extends String> = JSONDataLabel<T>

interface JSONDataLabel<T extends String> {
  version: 1
  name: string
  unit: T
}

// ---
// Object
// ---

interface DataLabel<T> {
  name: string
  unit: MathUnit<T> | T
  scientificName?: string
  // calculate: () => {}
}
