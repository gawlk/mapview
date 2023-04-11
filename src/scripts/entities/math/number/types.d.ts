interface MathNumber {
  value: number
  readonly unit: MathUnit<string>
  displayedString: string
  displayedStringWithUnit: string
  readonly updateValue: (value: number) => void
  readonly updateDisplayedStrings: () => void
  readonly getLocaleString: (
    options?: MathNumberGetLocaleStringOptions
  ) => string
  readonly getValueAs: (unit: string) => number
  readonly toJSON: () => number | null
}
