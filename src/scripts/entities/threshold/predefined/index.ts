import { colorsClasses } from '/src/scripts'

export const createPredefinedThreshold = (
  name: string,
  value: number
): PredefinedThreshold => {
  return {
    kind: 'predefined',
    name,
    value,
    getColor: function (mathNumber: MathNumber, colors: ThresholdColors) {
      const hexColorLow = colorsClasses[colors.low].hexColor
      const hexColorHigh = colorsClasses[colors.high].hexColor

      return mathNumber.value < this.value ? hexColorLow : hexColorHigh
    },
  }
}
