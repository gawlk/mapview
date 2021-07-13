interface MathUnit {
  name: string
  currentUnit: string
  currentPrecision: number
  possibleSettings: [string, number][]
  possiblePrecisions: number[]
  locked: boolean
}
