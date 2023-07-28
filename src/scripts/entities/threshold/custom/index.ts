import { baseHexColor, blend, colors, roundValue } from '/src/scripts'

const convertToRoundedCurrent = (
  valueToConvert: number,
  unit: MathUnit<string>
) => roundValue(unit.baseToCurrent(valueToConvert), unit.currentPrecision)

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
    getColor(mathNumber: MathNumber, jsonColors: JSONThresholdColors) {
      const hexColorLow = colors[jsonColors.low]
      const hexColorMiddle = colors[jsonColors.middle]
      const hexColorHigh = colors[jsonColors.high]

      const { unit } = mathNumber

      if (!mathNumber.checkValidity()) {
        return baseHexColor
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
