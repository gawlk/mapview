// ---
// JSON
// ---

interface JSONMathUnit<PossibleUnits> {
  readonly version: 1
  readonly unit: PossibleUnits
  readonly precision: number
}

// ---
// Object
// ---

interface MathUnit<PossibleUnits> {
  readonly name: string
  readonly baseUnit: string
  readonly possibleSettings: [string, number][]
  readonly possiblePrecisions: number[]
  readonly min: number
  readonly max: number | null
  readonly step: number
  readonly readOnly: boolean
  currentUnit: string
  currentPrecision: number
  readonly getAverage: (values: number[]) => number
  readonly toJSON: () => JSONMathUnit<PossibleUnits>
}
