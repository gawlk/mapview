// ---
// JSON
// ---

type JSONDataLabelVAny<T extends string> = JSONDataLabel<T>

interface JSONDataLabel<T extends string> {
  readonly version: 1
  readonly name: string
  readonly unit?: T
}

// ---
// Object
// ---

interface DataLabel<T extends string = string, Unit extends string = string> {
  readonly name: string
  readonly shortName?: string
  readonly unit?: MathUnit<T>
  readonly category: DataCategory
  readonly getDisplayedName: () => string
  readonly getSerializedName: () => string
  readonly toJSON: () => JSONDataLabel<Unit>
}
