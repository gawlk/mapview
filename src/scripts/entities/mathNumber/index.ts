import { unit as Unit, createUnit } from 'mathjs'

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
    value: typeof unit !== 'string' ? Unit(value, unit.currentUnit) : value,
    unit,
    displayString: '',
    displayStringWithUnit: '',
    toDisplayedValue: function () {
      let value =
        typeof this.value !== 'number' && typeof this.unit !== 'string'
          ? this.value.toNumber(
              this.unit.currentUnit === '°C'
                ? 'degC'
                : this.unit.currentUnit === '°F'
                ? 'degF'
                : this.unit.currentUnit === '1/100 mm'
                ? 'cmm'
                : this.unit.currentUnit === 'lbs'
                ? 'nlbs'
                : this.unit.currentUnit
            )
          : (this.value as number)

      if (this.unit !== 'string') {
        const mathUnit = this.unit as MathUnit

        // We assume there is only one unit so there is no need to specify the unit of min and max displayed values

        if (mathUnit.minDisplayedValue && value < mathUnit.minDisplayedValue) {
          this.displayString = `< ${numberToLocaleString(
            mathUnit.minDisplayedValue,
            mathUnit.currentPrecision
          )}`
        } else if (
          mathUnit.maxDisplayedValue &&
          value > mathUnit.maxDisplayedValue
        ) {
          this.displayString = `> ${numberToLocaleString(
            mathUnit.maxDisplayedValue,
            mathUnit.currentPrecision
          )}`
        } else {
          this.displayString = numberToLocaleString(
            value,
            mathUnit.currentPrecision
          )
        }
      } else {
        this.displayString = numberToLocaleString(value)
      }

      const unit =
        typeof this.unit !== 'string' ? this.unit.currentUnit : this.unit

      this.displayStringWithUnit = `${this.displayString} ${unit}`
    },
  })

  mathNumber.toDisplayedValue()

  // TODO: Put in init ?
  // Add to watcher manager etc...
  watch(
    () => mathNumber.value,
    () => {
      mathNumber.toDisplayedValue()
    }
  )

  if (typeof unit === 'object') {
    watch(unit, () => {
      mathNumber.toDisplayedValue()
    })
  }

  return mathNumber
}
