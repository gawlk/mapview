interface DataLabel {
  name: string
  unit: MathUnit
  scientificName?: string
  // calculate: () => {}
}

type JSONDataLabel = string

interface DataValue {
  readonly label: DataLabel
  value: MathNumber
}

interface JSONDataValue {
  label: JSONDataLabel
  value: number
}
