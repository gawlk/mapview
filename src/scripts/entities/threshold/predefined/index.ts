import { baseHexColor, colors } from '/src/scripts'

export const createPredefinedThreshold = (
  name: string,
  value: number,
): PredefinedThreshold => {
  return {
    kind: 'predefined',
    name,
    value,
    getColor(mathNumber: MathNumber, jsonColors: JSONThresholdColors) {
      if (!mathNumber.checkValidity()) {
        return baseHexColor
      }

      const hexColorLow = colors[jsonColors.low]
      const hexColorHigh = colors[jsonColors.high]

      return mathNumber.value < this.value ? hexColorLow : hexColorHigh
    },
  }
}

export const defaultThresholds = {
  deflection: [
    createPredefinedThreshold('N.S.', 0),
    createPredefinedThreshold('D1', 0.0002),
    createPredefinedThreshold('D2', 0.0003),
    createPredefinedThreshold('D3', 0.00045),
    createPredefinedThreshold('D4', 0.00075),
    createPredefinedThreshold('D5', 0.001),
    createPredefinedThreshold('D6', 0.0015),
    createPredefinedThreshold('D7', 0.002),
    createPredefinedThreshold('D8', 0.003),
    createPredefinedThreshold('D9', 0.01),
  ],

  modulus: [
    createPredefinedThreshold('N.S.', 0),
    createPredefinedThreshold('AR1', 20000000),
    createPredefinedThreshold('AR2', 50000000),
    createPredefinedThreshold('AR3', 120000000),
    createPredefinedThreshold('AR4', 200000000),
    createPredefinedThreshold('PF1', 20000000),
    createPredefinedThreshold('PF2', 50000000),
    createPredefinedThreshold('PF2+', 80000000),
    createPredefinedThreshold('PF3', 120000000),
    createPredefinedThreshold('PF4', 200000000),
  ],
}
