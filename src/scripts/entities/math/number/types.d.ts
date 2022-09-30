interface MathNumber {
  value: number
  unit: MathUnit<string> | string
  displayedString: string
  displayedStringWithUnit: string
  updateDisplayedStrings: () => void
  getLocaleString: (options: MathNumberGetLocaleStringOptions) => string
  getValueAs: (unit: string) => number
}

interface MathNumberGetLocaleStringOptions {
  appendUnitToString?: true
  locale?: string
  precision?: number
  disablePreString?: true
  unit?: string
  removeSpaces?: true
  disableMinAndMax?: true
}
