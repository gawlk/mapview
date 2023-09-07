interface PredefinedThreshold extends Threshold {
  readonly kind: 'predefined'
  readonly value: number
}
