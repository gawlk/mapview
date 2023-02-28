import { numberToLocaleString } from '/src/locales'

import { convertValueFromUnitAToUnitB } from '/src/scripts'

export const createMathNumber = (
  value: number,
  unit: MathUnit<string>
): MathNumber => {
  const mathNumber = createMutable({
    value,
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
    getLocaleString: function (options: MathNumberGetLocaleStringOptions = {}) {
      const numberToLocaleOptions = {
        locale: options.locale,
        precision: options.precision,
      }

      let value = this.value
      let preString = ''

      if (this.unit) {
        numberToLocaleOptions.precision ??= this.unit.currentPrecision

        if (!options.disableMinAndMax) {
          if (this.value < this.unit.min) {
            value = this.unit.min
            preString = '<'
          } else if (this.unit.max && this.value > this.unit.max) {
            value = this.unit.max
            preString = '>'
          }
        }

        value = convertValueFromUnitAToUnitB(
          value,
          this.unit.baseUnit,
          options.unit ?? this.unit.currentUnit
        )
      }

      const localeString = `${
        options.disablePreString ? '' : preString
      } ${numberToLocaleString(value, numberToLocaleOptions)} ${
        options.appendUnitToString && this.unit ? this.unit.currentUnit : ''
      }`.trim()

      return options.removeSpaces
        ? localeString.replaceAll(' ', '')
        : localeString
    },
  })

  mathNumber.updateDisplayedStrings()

  return mathNumber
}
