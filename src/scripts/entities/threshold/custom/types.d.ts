// ---
// JSON
// ---

interface JSONCustomThreshold {
  readonly version: 1
  readonly type: CustomThresholdType
  readonly value: number
  readonly valueHigh: number
}

type CustomThresholdType = 'Bicolor' | 'Gradient' | 'Tricolor'

// ---
// Object
// ---

interface CustomThreshold extends Threshold {
  readonly kind: 'custom'
  readonly name: 'Custom'
  readonly type: ASS<CustomThresholdType>
  readonly valueHigh: ASS<number>
  readonly toJSON: () => JSONCustomThreshold
}
