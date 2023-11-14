import {
  baseHexColor,
  blend,
  colors,
  createASS,
  roundValue,
} from '/src/scripts'

const convertToRoundedCurrent = (
  valueToConvert: number,
  unit: MathUnit<string>,
) =>
  roundValue(
    unit.baseToCurrent(unit.capValue(valueToConvert)),
    unit.currentPrecision(),
  )

export const createCustomThreshold = (
  json: JSONCustomThreshold,
  unit: MathUnit<string>,
): CustomThreshold => {
  // upgrade JSON

  const value = createASS(json.value)

  const valueHigh = createASS(json.valueHigh)

  const lowThresholdValue = createMemo(() =>
    convertToRoundedCurrent(value(), unit),
  )

  const highThresholdValue = createMemo(() =>
    convertToRoundedCurrent(valueHigh(), unit),
  )

  const threshold: CustomThreshold = {
    kind: 'custom',
    name: 'Custom',
    unit,
    type: createASS(json.type),
    value,
    valueHigh,
    getColor(mathNumber, thresholdColors) {
      const hexColorLow = colors[thresholdColors.low()]
      const hexColorMiddle = colors[thresholdColors.middle()]
      const hexColorHigh = colors[thresholdColors.high()]

      if (unit !== mathNumber.unit) {
        throw Error('Passed mathNumber with wrong unit')
      }

      if (!mathNumber.isValid()) {
        return baseHexColor
      }

      const testedValue = mathNumber.displayedValue()

      let color = hexColorHigh

      if (testedValue < lowThresholdValue()) {
        color = hexColorLow
      } else if (
        this.type() !== 'Bicolor' &&
        testedValue < highThresholdValue()
      ) {
        color =
          this.type() === 'Tricolor'
            ? hexColorMiddle
            : blend(
                hexColorLow,
                hexColorHigh,
                (testedValue - lowThresholdValue()) / highThresholdValue(),
              )
      }

      return color
    },
    toJSON(): JSONCustomThreshold {
      return {
        version: 1,
        type: this.type(),
        value: this.value(),
        valueHigh: this.valueHigh(),
      }
    },
  }

  return threshold
}
