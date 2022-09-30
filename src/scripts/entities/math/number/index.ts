import { convertValueFromUnitAToUnitB } from '/src/scripts'

import { numberToLocaleString } from '/src/locales'

export const createMathNumber = (
  value: number,
  unit: MathUnit<string> | string
): MathNumber => {
  const mathNumber = shallowReactive({
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
    getValueAs: function (unit: string) {
      return typeof this.unit === 'object'
        ? convertValueFromUnitAToUnitB(this.value, this.unit.baseUnit, unit)
        : this.value
    },
    getLocaleString: function (options: MathNumberGetLocaleStringOptions = {}) {
      const numberToLocaleOptions = {
        locale: options.locale,
        precision: options.precision,
      }

      let value = this.value
      let preString = ''

      if (typeof this.unit !== 'string') {
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
        options.appendUnitToString
          ? typeof this.unit !== 'string'
            ? this.unit.currentUnit
            : this.unit
          : ''
      }`.trim()

      return options.removeSpaces
        ? localeString.replaceAll(' ', '')
        : localeString
    },
  })

  mathNumber.updateDisplayedStrings()

  return mathNumber
}
