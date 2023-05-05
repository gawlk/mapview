interface MathNumber {
  value: number
  readonly unit: MathUnit<string>
  displayedString: string
  displayedStringWithUnit: string
  readonly updateValue: (value: number, asCurrent?: true) => void
  readonly updateDisplayedStrings: () => void
  readonly getLocaleString: (
    options: MathNumberGetLocaleStringOptions
  ) => string
  readonly getValueAs: (unit: string) => number
  readonly toCurrent: () => number
}

interface MathNumberGetLocaleStringOptions {
  readonly appendUnitToString?: true
  readonly locale?: string
  readonly precision?: number
  readonly disablePreString?: true
  readonly unit?: string
  readonly removeSpaces?: true
  readonly disableMinAndMax?: true
}
