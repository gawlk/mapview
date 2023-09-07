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
  type: CustomThresholdType
  value: number
  valueHigh: number
  readonly toJSON: () => JSONCustomThreshold
}
