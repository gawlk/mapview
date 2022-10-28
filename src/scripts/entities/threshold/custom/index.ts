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

      return mathNumber.value < this.value
        ? hexColorLow
        : this.type !== 'Bicolor' && mathNumber.value < this.valueHigh
        ? this.type === 'Tricolor'
          ? hexColorMiddle
          : blend(
              hexColorLow,
              hexColorHigh,
              (mathNumber.value - this.value) / this.valueHigh
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
