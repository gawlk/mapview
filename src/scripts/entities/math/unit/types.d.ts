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
  readonly readOnly: boolean
  min: number
  max: number
  currentUnit: PossibleUnits
  currentPrecision: number
  readonly getAverage: (values: number[]) => number
  readonly currentToBase: (value: number) => number
  readonly baseToCurrent: (value: number) => number
  readonly isValid: (value: number) => boolean
  readonly valueToString: (
    value: number,
    options?: MathUnitGetLocaleStringOptions
  ) => string
  readonly toJSON: () => JSONMathUnit<PossibleUnits>
}

interface MathUnitGetLocaleStringOptions {
  readonly appendUnitToString?: true
  readonly locale?: string
  readonly precision?: number
  readonly disablePreString?: true
  readonly unit?: string
  readonly removeSpaces?: true
  readonly disableMinAndMax?: true
}
