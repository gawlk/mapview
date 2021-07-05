import { unit as Unit, createUnit } from 'mathjs'
import { shallowReactive, watch } from 'vue'

createUnit({
  cmm: '10 um',
  nlbs: '4.448221628250858 N',
})

export const createMathNumber = (value: number, unit: MathUnit): MathNumber => {
  const mathNumber = shallowReactive({
    value: Unit(value, unit.currentUnit),
    unit,
    displayString: '',
    displayStringWithUnit: '',
    toDisplayedValue: function () {
      const value = this.value.toNumber(
        this.unit.currentUnit === '1/100 mm'
          ? 'cmm'
          : this.unit.currentUnit === 'lbs'
          ? 'nlbs'
          : this.unit.currentUnit
      )

      this.displayString = value.toLocaleString(navigator.language, {
        minimumFractionDigits: this.unit.currentPrecision,
        maximumFractionDigits: this.unit.currentPrecision,
      })

      this.displayStringWithUnit = `${this.displayString} ${this.unit.currentUnit}`
    },
  })

  mathNumber.toDisplayedValue()

  watch(unit, () => {
    mathNumber.toDisplayedValue()
  })

  return mathNumber
}
