import { numberToLocaleString } from '/src/locales'

import { convertValueFromUnitAToUnitB } from '/src/scripts'

export const createMathNumber = (
  value: number,
  unit: MathUnit<string>
): MathNumber => {
  const mathNumber = shallowReactive({
    value,
    unit,
    displayedString: '',
    displayedStringWithUnit: '',
    updateDisplayedStrings() {
      this.displayedString = this.getLocaleString()

      this.displayedStringWithUnit = this.getLocaleString({
        appendUnitToString: true,
      })
    },
    updateValue(newValue: number) {
      this.value = newValue

      this.updateDisplayedStrings()
    },
    getValueAs(unitAs: string) {
      return convertValueFromUnitAToUnitB(
        this.value,
        this.unit.baseUnit,
        unitAs
      )
    },
    getLocaleString(options: MathNumberGetLocaleStringOptions = {}) {
      const numberToLocaleOptions = {
        locale: options.locale,
        precision: options.precision,
      }

      let currentValue = this.value
      let preString = ''

      if (this.unit) {
        numberToLocaleOptions.precision ??= this.unit.currentPrecision

        if (!options.disableMinAndMax) {
          if (this.value < this.unit.min) {
            currentValue = this.unit.min
            preString = '<'
          } else if (this.unit.max && this.value > this.unit.max) {
            currentValue = this.unit.max
            preString = '>'
          }
        }

        currentValue = convertValueFromUnitAToUnitB(
          currentValue,
          this.unit.baseUnit,
          options.unit ?? this.unit.currentUnit
        )
      }

      const localeString = `${
        options.disablePreString ? '' : preString
      } ${numberToLocaleString(currentValue, numberToLocaleOptions)} ${
        options.appendUnitToString ? this.unit.currentUnit : ''
      }`.trim()

      return options.removeSpaces
        ? localeString.replaceAll(' ', '')
        : localeString
    },
  })

  mathNumber.updateDisplayedStrings()

  return mathNumber
}
