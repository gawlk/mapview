// ---
// JSON
// ---

interface JSONMathUnit<PossibleUnits> {
  readonly version: 1
  readonly currentUnit: PossibleUnits
  readonly currentPrecision: number
  readonly max: number
  readonly min?: number
}

// ---
// Object
// ---

interface MathUnit<PossibleUnits> {
  readonly name: string
  readonly baseUnit: string
  readonly possibleSettings: [PossibleUnits, number][]
  readonly possiblePrecisions: number[]
  readonly min: number
  readonly max: number
  readonly step: number
  readonly readOnly: boolean
  currentUnit: PossibleUnits
  currentPrecision: number
  readonly getAverage: (values: number[]) => number
  readonly toJSON: () => JSONMathUnit<PossibleUnits>
}
