import { unit as Unit, createUnit } from 'mathjs'
import { shallowReactive, watch } from 'vue'

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
              this.unit.currentUnit === '1/100 mm'
                ? 'cmm'
                : this.unit.currentUnit === 'lbs'
                ? 'nlbs'
                : this.unit.currentUnit
            )
          : (this.value as number)

      const toLocaleString = (value: number, precision: number = 0) =>
        value.toLocaleString(navigator.language, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        })

      if (this.unit !== 'string') {
        const mathUnit = this.unit as MathUnit

        if (mathUnit.min && value < mathUnit.min) {
          this.displayString = `< ${toLocaleString(
            mathUnit.min,
            mathUnit.currentPrecision
          )}`
        } else if (mathUnit.max && value > mathUnit.max) {
          this.displayString = `> ${toLocaleString(
            mathUnit.max,
            mathUnit.currentPrecision
          )}`
        } else {
          this.displayString = toLocaleString(value)
        }
      } else {
        this.displayString = toLocaleString(value)
      }

      const unit =
        typeof this.unit !== 'string' ? this.unit.currentUnit : this.unit

      this.displayStringWithUnit = `${this.displayString} ${unit}`
    },
  })

  mathNumber.toDisplayedValue()

  if (typeof unit === 'object') {
    watch(unit, () => {
      mathNumber.toDisplayedValue()
    })
  }

  return mathNumber
}
