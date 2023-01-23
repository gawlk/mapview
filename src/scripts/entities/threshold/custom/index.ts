import { blend, colorsClasses } from '/src/scripts'

export const createCustomThreshold = (parameters: {
  type: CustomThresholdType
  value: number
  valueHigh: number
}): CustomThreshold => {
  return shallowReactive({
    kind: 'custom',
    name: 'Custom',
    type: parameters.type,
    value: parameters.value,
    valueHigh: parameters.valueHigh,
    getColor: function (mathNumber: MathNumber, colors: JSONThresholdColors) {
      const hexColorLow = colorsClasses[colors.low].hexColor
      const hexColorMiddle = colorsClasses[colors.middle].hexColor
      const hexColorHigh = colorsClasses[colors.high].hexColor

      const value = Math.max(
        this.value,
        mathNumber.unit ? mathNumber.unit.min : -Infinity
      )

      const valueHigh = Math.min(
        this.valueHigh,
        mathNumber.unit ? mathNumber.unit.max : Infinity
      )

      return mathNumber.value < value
        ? hexColorLow
        : this.type !== 'Bicolor' && mathNumber.value < valueHigh
        ? this.type === 'Tricolor'
          ? hexColorMiddle
          : blend(
              hexColorLow,
              hexColorHigh,
              (mathNumber.value - value) / valueHigh
            )
        : hexColorHigh
    },
    toJSON: function (): JSONCustomThreshold {
      return {
        version: 1,
        type: this.type,
        value: this.value,
        valueHigh: this.valueHigh,
      }
    },
  })
}
