interface PredefinedThreshold {
  kind: 'predefined'
  name: string
  value: number
  getColor: (mathNumber: MathNumber, colors: ThresholdColors) => string
}
