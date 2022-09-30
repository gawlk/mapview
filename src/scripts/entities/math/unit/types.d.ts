interface MathUnit<PossibleUnits> {
  name: string
  baseUnit: string
  currentUnit: string
  currentPrecision: number
  possibleSettings: [string, number][]
  possiblePrecisions: number[]
  min: number
  max: number | null
  step: number
  readOnly: boolean
  getAverage: (values: number[]) => number
  toJSON: () => JSONMathUnit<PossibleUnits>
}

interface JSONMathUnit<PossibleUnits> {
  unit: PossibleUnits
  precision: number
}
