import { baseHexColor, blend, colors, roundValue } from '/src/scripts'

const convertToRoundedCurrent = (
  valueToConvert: number,
  unit: MathUnit<string>,
) =>
  roundValue(
    unit.baseToCurrent(unit.capValue(valueToConvert)),
    unit.currentPrecision,
  )

export const createCustomThreshold = (
  json: JSONCustomThreshold,
  unit: MathUnit<string>,
): CustomThreshold => {
  // upgrade JSON

  return createMutable({
    kind: 'custom',
    name: 'Custom',
    unit,
    type: json.type,
    value: json.value,
    valueHigh: json.valueHigh,
    getColor(mathNumber: MathNumber, jsonColors: JSONThresholdColors) {
      const hexColorLow = colors[jsonColors.low]
      const hexColorMiddle = colors[jsonColors.middle]
      const hexColorHigh = colors[jsonColors.high]

      if (unit !== mathNumber.unit) {
        throw Error('Passed mathNumber with wrong unit')
      }

      if (!mathNumber.checkValidity()) {
        return baseHexColor
      }

      const lowThresholdValue = convertToRoundedCurrent(this.value, unit)

      const highThresholdValue = convertToRoundedCurrent(this.valueHigh, unit)

      const testedValue = mathNumber.displayedValue

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
                (testedValue - lowThresholdValue) / highThresholdValue,
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
