interface MathUnit {
  name: string
  baseUnit: string
  currentUnit: string
  currentPrecision: number
  possibleSettings: [string, number][]
  possiblePrecisions: number[]
  min: number
  max: number | null
  step: number
  getAverage: (values: number[]) => number
}
