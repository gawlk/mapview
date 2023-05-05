import { blend, colors } from '/src/scripts'

export const createCustomThreshold = (parameters: {
  type: CustomThresholdType
  value: number
  valueHigh: number
}): CustomThreshold => {
  return createMutable({
    kind: 'custom',
    name: 'Custom',
    type: parameters.type,
    value: parameters.value,
    valueHigh: parameters.valueHigh,
    getColor: function (
      mathNumber: MathNumber,
      jsonColors: JSONThresholdColors
    ) {
      const hexColorLow = colors[jsonColors.low]
      const hexColorMiddle = colors[jsonColors.middle]
      const hexColorHigh = colors[jsonColors.high]

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
