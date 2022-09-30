interface PredefinedThreshold {
  kind: 'predefined'
  name: string
  value: number
  getColor: (mathNumber: MathNumber, colors: JSONThresholdColors) => string
}
