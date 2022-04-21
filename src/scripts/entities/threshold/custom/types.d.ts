interface CustomThreshold {
  kind: 'custom'
  name: 'Custom'
  type: CustomThresholdType
  value: number
  valueHigh: number
  getColor: (mathNumber: MathNumber, colors: ThresholdColors) => string
}

type CustomThresholdType = 'Bicolor' | 'Gradient' | 'Tricolor'
