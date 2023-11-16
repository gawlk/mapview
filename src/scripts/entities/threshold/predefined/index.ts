import { baseHexColor, colors, createASS } from '/src/scripts'

export const createPredefinedThreshold = (
  name: string,
  value: number,
  unit: MathUnit<string>,
): PredefinedThreshold => {
  return {
    kind: 'predefined',
    name,
    value: createASS(value),
    unit,
    getColor(mathNumber, thresholdColors) {
      if (unit !== mathNumber.unit) {
        throw Error('Got a mathnumber with a different unit than expected')
      }

      if (!mathNumber.isValid()) {
        return baseHexColor
      }

      const hexColorLow = colors[thresholdColors.low()]
      const hexColorHigh = colors[thresholdColors.high()]

      return mathNumber.displayedValue() <
        unit.baseToCurrent(unit.capValue(this.value()))
        ? hexColorLow
        : hexColorHigh
    },
  }
}

export const createDefaultDeflectionThresholds = (unit: MathUnit<string>) => [
  createPredefinedThreshold('N.S.', 0, unit),
  createPredefinedThreshold('D1', 0.0002, unit),
  createPredefinedThreshold('D2', 0.0003, unit),
  createPredefinedThreshold('D3', 0.00045, unit),
  createPredefinedThreshold('D4', 0.00075, unit),
  createPredefinedThreshold('D5', 0.001, unit),
  createPredefinedThreshold('D6', 0.0015, unit),
  createPredefinedThreshold('D7', 0.002, unit),
  createPredefinedThreshold('D8', 0.003, unit),
  createPredefinedThreshold('D9', 0.01, unit),
]

export const createDefaultModulusThresholds = (unit: MathUnit<string>) => [
  createPredefinedThreshold('N.S.', 0, unit),
  createPredefinedThreshold('AR1', 20000000, unit),
  createPredefinedThreshold('AR2', 50000000, unit),
  createPredefinedThreshold('AR3', 120000000, unit),
  createPredefinedThreshold('AR4', 200000000, unit),
  createPredefinedThreshold('PF1', 20000000, unit),
  createPredefinedThreshold('PF2', 50000000, unit),
  createPredefinedThreshold('PF2+', 80000000, unit),
  createPredefinedThreshold('PF3', 120000000, unit),
  createPredefinedThreshold('PF4', 200000000, unit),
]
