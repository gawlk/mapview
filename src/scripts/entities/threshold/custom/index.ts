import { blend, colorsClasses, gray, roundValue } from '/src/scripts'

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

      const { unit } = mathNumber

      if (!mathNumber.checkValidity()) {
        return gray
      }

      const lowThresholdValue = roundValue(
        unit.baseToCurrent(
          Math.max(this.value, unit ? mathNumber.unit.min : -Infinity)
        ),
        unit.currentPrecision
      )

      const highThresholdValue = roundValue(
        unit.baseToCurrent(
          Math.min(
            this.valueHigh,
            mathNumber.unit ? mathNumber.unit.max : Infinity
          )
        ),
        unit.currentPrecision
      )

      const value = roundValue(mathNumber.toCurrent(), unit.currentPrecision)

      let color = hexColorHigh

      if (value < lowThresholdValue) {
        color = hexColorLow
      } else if (this.type !== 'Bicolor' && value < highThresholdValue) {
        color =
          this.type === 'Tricolor'
            ? hexColorMiddle
            : blend(
                hexColorLow,
                hexColorHigh,
                (value - lowThresholdValue) / highThresholdValue
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
