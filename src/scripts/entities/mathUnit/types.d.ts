interface MathUnit {
  name: string
  currentUnit: string
  currentPrecision: number
  possibleSettings: [string, number][]
  possiblePrecisions: number[]
  minDisplayedValue?: number
  maxDisplayedValue?: number
  selectedThreshold?: PredefinedThreshold
  thresholds?: PredefinedThreshold[]
}
