import { unit as Unit, createUnit } from 'mathjs'

import { numberToLocaleString } from '/src/locales'

createUnit({
  cmm: '10 um',
  nlbs: '4.448221628250858 N',
})

const convertCurrentUnitToMathJSUnit = (currentUnit: string) =>
  currentUnit === '°C'
    ? 'degC'
    : currentUnit === '°F'
    ? 'degF'
    : currentUnit === '1/100 mm'
    ? 'cmm'
    : currentUnit === 'lbs'
    ? 'nlbs'
    : currentUnit

export const convertValueFromBaseUnitToCurrentUnit = (
  value: number,
  unit: MathUnit | string
) =>
  typeof unit !== 'string'
    ? Unit(value, convertCurrentUnitToMathJSUnit(unit.baseUnit)).toNumber(
        convertCurrentUnitToMathJSUnit(unit.currentUnit)
      )
    : value

export const convertValueFromCurrentUnitToBaseUnit = (
  value: number,
  unit: MathUnit | string
) =>
  typeof unit !== 'string'
    ? Unit(value, convertCurrentUnitToMathJSUnit(unit.currentUnit)).toNumber(
        convertCurrentUnitToMathJSUnit(unit.baseUnit)
      )
    : value

export const createMathNumber = (
  value: number,
  unit: MathUnit | string
): MathNumber => {
  const mathNumber = shallowReactive({
    value,
    unit,
    displayedString: '',
    displayedStringWithUnit: '',
    toDisplayedValue: function () {
      const convertedValue = convertValueFromBaseUnitToCurrentUnit(
        this.value,
        this.unit
      )

      if (this.unit !== 'string') {
        const mathUnit = this.unit as MathUnit

        // We assume there is only one unit so there is no need to specify the unit of min and max displayed values

        if (mathUnit.min && this.value < mathUnit.min) {
          this.displayedString = `< ${numberToLocaleString(
            convertValueFromBaseUnitToCurrentUnit(mathUnit.min, this.unit),
            mathUnit.currentPrecision
          )}`
        } else if (mathUnit.max && this.value > mathUnit.max) {
          this.displayedString = `> ${numberToLocaleString(
            convertValueFromBaseUnitToCurrentUnit(mathUnit.max, this.unit),
            mathUnit.currentPrecision
          )}`
        } else {
          this.displayedString = numberToLocaleString(
            convertedValue,
            mathUnit.currentPrecision
          )
        }
      } else {
        this.displayedString = numberToLocaleString(Math.floor(convertedValue))
      }

      const unit =
        typeof this.unit !== 'string' ? this.unit.currentUnit : this.unit

      this.displayedStringWithUnit = `${this.displayedString} ${unit}`
    },
  })

  mathNumber.toDisplayedValue()

  return mathNumber
}
