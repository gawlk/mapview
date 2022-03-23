interface DataLabel {
  name: string
  unit: MathUnit
  // calculate: () => {}
}

interface DataValue {
  label: DataLabel
  value: MathNumber | MathNumber[] | MathNumber[][]
}
