interface MathUnit {
  name: string
  currentUnit: string
  currentPrecision: number
  possibleSettings: [string, number][]
  possiblePrecisions: number[]
  min?: number
  max?: number
}
