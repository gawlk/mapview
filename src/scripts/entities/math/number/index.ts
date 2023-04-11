import { convertValueFromUnitAToUnitB } from '/src/scripts'

export const createMathNumber = (
  value: number | 'NaN',
  unit: MathUnit<string>
): MathNumber => {
  const mathNumber = shallowReactive({
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
    getLocaleString: function (options?: MathUnitGetLocaleStringOptions) {
      return this.unit.valueToString(this.value, options)
    },
    toJSON: function () {
      return this.value
    },
  })

  mathNumber.updateDisplayedStrings()

  return mathNumber
}
