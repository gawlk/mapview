interface PredefinedThreshold {
  readonly kind: 'predefined'
  readonly name: string
  readonly value: number
  readonly getColor: (
    mathNumber: MathNumber,
    colors: JSONThresholdColors,
  ) => string
}
