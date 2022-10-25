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
}

type CustomThresholdType = 'Bicolor' | 'Gradient' | 'Tricolor'
