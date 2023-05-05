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
  readonly name: UnitName
  readonly baseUnit: string
  readonly possibleSettings: [PossibleUnits, number][]
  readonly possiblePrecisions: number[]
  readonly readOnly: boolean
  min: number
  max: number
  currentUnit: PossibleUnits
  currentPrecision: number
  readonly getAverage: (values: number[]) => number
  readonly toJSON: () => JSONMathUnit<PossibleUnits>
  readonly currentToBase: (value: number) => number
  readonly baseToCurrent: (value: number) => number
}

type UnitName =
  | 'Deflection'
  | 'Force'
  | 'Modulus'
  | 'Temperature'
  | 'Distance'
  | 'Time'
  | 'CumSum'
  | 'Stiffness'
  | 'Percentage'
