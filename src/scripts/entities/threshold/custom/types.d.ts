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

interface CustomThreshold {
  readonly kind: 'custom'
  name: 'Custom'
  type: CustomThresholdType
  value: number
  valueHigh: number
  readonly getColor: (
    mathNumber: MathNumber,
    colors: JSONThresholdColors
  ) => string
  readonly toJSON: () => JSONCustomThreshold
}
