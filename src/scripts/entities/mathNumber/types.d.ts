interface MathNumber {
  value: number
  unit: MathUnit | string
  displayedString: string
  displayedStringWithUnit: string
  toDisplayedValue: () => void
}
