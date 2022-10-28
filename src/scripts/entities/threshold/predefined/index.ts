import { colorsClasses, createCustomThreshold } from '/src/scripts'

export const createPredefinedThreshold = (
  name: string,
  value: number
): PredefinedThreshold => {
  return {
    kind: 'predefined',
    name,
    value,
    getColor: function (mathNumber: MathNumber, colors: JSONThresholdColors) {
      const hexColorLow = colorsClasses[colors.low].hexColor
      const hexColorHigh = colorsClasses[colors.high].hexColor

      return mathNumber.value < this.value ? hexColorLow : hexColorHigh
    },
  }
}

export const defaultThresholds = {
  ns: createPredefinedThreshold('N.S.', 0),
  ar1: createPredefinedThreshold('AR1', 20000000),
  ar2: createPredefinedThreshold('AR2', 50000000),
  ar3: createPredefinedThreshold('AR3', 120000000),
  ar4: createPredefinedThreshold('AR4', 200000000),
  pf1: createPredefinedThreshold('PF1', 20000000),
  pf2: createPredefinedThreshold('PF2', 50000000),
  'pf2+': createPredefinedThreshold('PF2+', 80000000),
  pf3: createPredefinedThreshold('PF3', 120000000),
  pf4: createPredefinedThreshold('PF4', 200000000),
}
