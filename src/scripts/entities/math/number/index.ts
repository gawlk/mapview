import { numberToLocaleString } from '/src/locales'

import { convertValueFromUnitAToUnitB } from '/src/scripts'

export const createMathNumber = (
  value: JSONMathNumberValue,
  unit: MathUnit<string>,
) => {
  const mathNumber = createMutable<MathNumber>({
    value: Number(value ?? 'NaN'),
    unit,
    displayedString: '',
    displayedStringWithUnit: '',
    updateDisplayedStrings() {
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
