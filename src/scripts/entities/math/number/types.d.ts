type JSONMathNumberValue = number | 'NaN' | null

interface MathNumber {
  readonly value: Accessor<number>
  readonly displayedValue: Accessor<number>
  readonly displayedString: Accessor<string>
  readonly displayedStringWithUnit: Accessor<string>
  readonly unit: MathUnit<string>
  readonly isValid: Accessor<boolean>
  readonly getLocaleString: (options?: MathUnitGetLocaleStringOptions) => string
  readonly getValueAs: (unit: string) => number
  readonly toCurrent: () => number
  readonly toExcel: (asCurrent: boolean) => number | null
  readonly toJSON: () => JSONMathNumberValue
}

interface WritableMathNumber extends MathNumber {
  readonly setValue: (value: number, asCurrent?: true) => void
}
