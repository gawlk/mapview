import { convertValueFromUnitAToUnitB, roundValue } from '/src/scripts'

export const createMathNumber = (
  json: JSONMathNumberValue,
  unit: MathUnit<string>,
) => {
  const value = Number(json ?? 'NaN')

  const mathNumber = createMutable<MathNumber>({
    value,
    unit,
    displayedValue: value,
    displayedString: '',
    displayedStringWithUnit: '',
    updateDisplayedValue() {
      this.displayedValue = roundValue(
        this.unit.baseToCurrent(this.unit.capValue(this.value)),
        this.unit.currentPrecision,
      )
    },
    updateDisplayedStrings() {
      this.updateDisplayedValue()

      this.displayedString = this.getLocaleString()

      this.displayedStringWithUnit = this.getLocaleString({
        appendUnitToString: true,
      })
    },
    updateValue(newValue: number, asCurrent?: true) {
      this.value = asCurrent ? this.unit.currentToBase(newValue) : newValue

      this.updateDisplayedStrings()
    },
    getValueAs(unitAs: string) {
      return convertValueFromUnitAToUnitB(
        this.value,
        this.unit.baseUnit,
        unitAs,
      )
    },
    checkValidity() {
      return this.unit.checkValidity(this.value)
    },
    getLocaleString(options?) {
      return this.unit.valueToLocaleString(this.value, options)
    },
    toCurrent() {
      return this.unit.baseToCurrent(this.value)
    },
    toExcel(asCurrent = false) {
      if (!this.checkValidity()) {
        return null
      }

      return asCurrent ? this.toCurrent() : this.value
    },
    toJSON() {
      return Number.isNaN(this.value) ? 'NaN' : this.value
    },
  })

  mathNumber.updateDisplayedStrings()

  return mathNumber
}
