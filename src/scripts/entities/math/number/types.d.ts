type JSONMathNumberValue = number | 'NaN' | null

interface MathNumber {
  value: number
  readonly unit: MathUnit<string>
  displayedString: string
  displayedStringWithUnit: string
  readonly checkValidity: () => boolean
  readonly updateValue: (value: number, asCurrent?: true) => void
  readonly updateDisplayedStrings: () => void
  readonly getLocaleString: (options?: MathUnitGetLocaleStringOptions) => string
  readonly getValueAs: (unit: string) => number
  readonly toCurrent: () => number
  readonly toExcel: (asCurrent: boolean) => number | null
  readonly toJSON: () => JSONMathNumberValue
}
