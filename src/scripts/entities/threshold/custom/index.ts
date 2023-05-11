import { blend, colorsClasses, gray } from '/src/scripts'

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
    getColor(mathNumber: MathNumber, colors: JSONThresholdColors) {
      const hexColorLow = colorsClasses[colors.low].hexColor
      const hexColorMiddle = colorsClasses[colors.middle].hexColor
      const hexColorHigh = colorsClasses[colors.high].hexColor

      if (!mathNumber.checkValidity()) {
        return gray
      }

      const value = Math.max(
        this.value,
        mathNumber.unit ? mathNumber.unit.min : -Infinity
      )

      const valueHigh = Math.min(
        this.valueHigh,
        mathNumber.unit ? mathNumber.unit.max : Infinity
      )

      let color = hexColorHigh

      if (mathNumber.value < value) {
        color = hexColorLow
      } else if (this.type !== 'Bicolor' && mathNumber.value < valueHigh) {
        color =
          this.type === 'Tricolor'
            ? hexColorMiddle
            : blend(
                hexColorLow,
                hexColorHigh,
                (mathNumber.value - value) / valueHigh
              )
      }

      return color
    },
    toJSON(): JSONCustomThreshold {
      return {
        version: 1,
        type: this.type,
        value: this.value,
        valueHigh: this.valueHigh,
      }
    },
  })
}
