import { convertValueFromUnitAToUnitB } from '/src/scripts'

export const createMathNumber = (
  value: JSONMathNumberValue,
  unit: MathUnit<string>
): MathNumber => {
  const mathNumber: MathNumber = shallowReactive({
    value: Number(value),
    unit,
    displayedString: '',
    displayedStringWithUnit: '',
    updateDisplayedStrings: function () {
      this.displayedString = this.getLocaleString()

      this.displayedStringWithUnit = this.getLocaleString({
        appendUnitToString: true,
      })
    },
    updateValue: function (value: number) {
      this.value = value

      this.updateDisplayedStrings()
    },
    getValueAs: function (unit: string) {
      return convertValueFromUnitAToUnitB(this.value, this.unit.baseUnit, unit)
    },
    checkValidity: function () {
      return this.unit.checkValidity(this.value)
    },
    getLocaleString: function (options?) {
      return this.unit.valueToString(this.value, options)
    },
    toJSON: function () {
      return isNaN(this.value) ? 'NaN' : this.value
    },
  })

  mathNumber.updateDisplayedStrings()

  return mathNumber
}
