interface MathNumber {
  value: number
  unit: MathUnit | string
  displayedString: string
  displayedStringWithUnit: string
  updateDisplayedStrings: () => void
  getLocaleString: (options: MathNumberGetLocaleStringOptions) => string
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
