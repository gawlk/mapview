import { blend, colorsClasses, gray, roundValue } from '/src/scripts'

const convertToRoundedCurrent = (
  valueToConvert: number,
  unit: MathUnit<string>
) => roundValue(unit.baseToCurrent(valueToConvert), unit.currentPrecision)

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

      const lowThresholdValue = convertToRoundedCurrent(
        Math.max(this.value, unit ? mathNumber.unit.min : -Infinity),
        unit
      )

      const highThresholdValue = convertToRoundedCurrent(
        Math.min(
          this.valueHigh,
          mathNumber.unit ? mathNumber.unit.max : Infinity
        ),
        unit
      )

      const testedValue = roundValue(
        mathNumber.toCurrent(),
        unit.currentPrecision
      )

      let color = hexColorHigh

      if (testedValue < lowThresholdValue) {
        color = hexColorLow
      } else if (this.type !== 'Bicolor' && testedValue < highThresholdValue) {
        color =
          this.type === 'Tricolor'
            ? hexColorMiddle
            : blend(
                hexColorLow,
                hexColorHigh,
                (testedValue - lowThresholdValue) / highThresholdValue
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
