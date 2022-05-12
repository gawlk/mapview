import { createUnit } from 'mathjs'

import { convertValueFromUnitAToUnitB } from '/src/scripts'

import { numberToLocaleString } from '/src/locales'

createUnit({
  cmm: '10 um',
  nlbs: '4.448221628250858 N',
})

export const createMathNumber = (
  value: number,
  unit: MathUnit | string
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
    getLocaleString: function (options: MathNumberGetLocaleStringOptions = {}) {
      const numberToLocaleOptions = {
        locale: options.locale,
        precision: options.precision,
      }

      let value = this.value
      let preString = ''

      if (typeof this.unit !== 'string') {
        numberToLocaleOptions.precision ??= this.unit.currentPrecision

        if (this.value < this.unit.min) {
          value = this.unit.min
          preString = '<'
        } else if (this.value > this.unit.max) {
          value = this.unit.max
          preString = '>'
        }

        value = convertValueFromUnitAToUnitB(
          value,
          this.unit.baseUnit,
          options.unit ?? this.unit.currentUnit
        )
      }

      return `${
        options.disablePreString ? '' : preString
      } ${numberToLocaleString(value, numberToLocaleOptions)} ${
        options.appendUnitToString
          ? typeof this.unit !== 'string'
            ? this.unit.currentUnit
            : this.unit
          : ''
      }`.trim()
    },
  })

  mathNumber.updateDisplayedStrings()

  return mathNumber
}
