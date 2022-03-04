interface MathUnit {
  name: string
  currentUnit: string
  currentPrecision: number
  possibleSettings: [string, number][]
  possiblePrecisions: number[]
  minDisplayedValue?: number
  maxDisplayedValue?: number
  thresholds?: {
    selected: PredefinedThreshold | CustomThreshold | null
    list: PredefinedThreshold[]
    // custom: CustomThreshold
  }
}
