interface MathNumber {
  value: number
  readonly unit: MathUnit<string>
  displayedString: string
  displayedStringWithUnit: string
  readonly isValid: () => boolean
  readonly updateValue: (value: number) => void
  readonly updateDisplayedStrings: () => void
  readonly getLocaleString: (options?: MathUnitGetLocaleStringOptions) => string
  readonly getValueAs: (unit: string) => number
  readonly toJSON: () => JSONMathNumberValue
}

type JSONMathNumberValue = number | 'NaN'
