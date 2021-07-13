interface MathNumber {
  value: math.Unit | number
  unit: MathUnit | string
  displayString: string
  displayStringWithUnit: string
  toDisplayedValue: () => void
}

type MathNumberObject = { [key: string]: MathNumber }
