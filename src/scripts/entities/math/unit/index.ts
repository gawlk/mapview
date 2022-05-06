import { unit as Unit } from 'mathjs'

export const createMathUnit = <PossibleUnits extends string>(
  name: string,
  baseUnit: string,
  possibleSettings: [PossibleUnits, number][],
  options: {
    currentUnit: PossibleUnits
    possiblePrecisions?: number[]
    currentPrecision?: number
    min?: number
    max?: number
    step?: number
    averageFunction?: 'allEqual' | 'capOutliers' | 'ignoreOutliers'
  }
): MathUnit => {
  const currentUnit = options.currentUnit || possibleSettings[0][0]
  const possiblePrecisions = options.possiblePrecisions || [0, 1, 2]
  const currentPrecision = options.currentPrecision || possibleSettings[0][1]
  const min = options.min || 0
  const max = options.max || 1000
  const step = options.step || 1

  return shallowReactive({
    name,
    baseUnit,
    possibleSettings,
    currentUnit,
    possiblePrecisions,
    currentPrecision,
    min,
    max,
    step,
    getAverage: function (values: number[]) {
      const filteredValues: number[] = values.filter((value) =>
        options.averageFunction === 'ignoreOutliers'
          ? value <= this.max && value >= this.min
          : true
      )

      return (
        filteredValues.reduce(
          (total, currentValue) =>
            total +
            (options.averageFunction === 'capOutliers'
              ? currentValue > this.max
                ? this.max
                : currentValue < this.min
                ? this.min
                : currentValue
              : currentValue),
          0
        ) / filteredValues.length
      )
    },
  })
}

const convertCurrentUnitToMathJSUnit = (currentUnit: string) =>
  currentUnit === '°C'
    ? 'degC'
    : currentUnit === '°F'
    ? 'degF'
    : currentUnit === '1/100 mm'
    ? 'cmm'
    : currentUnit === 'lbs'
    ? 'nlbs'
    : currentUnit

export const convertValueFromBaseUnitToCurrentUnit = (
  value: number,
  unit: MathUnit | string
) =>
  typeof unit !== 'string'
    ? Unit(value, convertCurrentUnitToMathJSUnit(unit.baseUnit)).toNumber(
        convertCurrentUnitToMathJSUnit(unit.currentUnit)
      )
    : value

export const convertValueFromCurrentUnitToBaseUnit = (
  value: number,
  unit: MathUnit | string
) =>
  typeof unit !== 'string'
    ? Unit(value, convertCurrentUnitToMathJSUnit(unit.currentUnit)).toNumber(
        convertCurrentUnitToMathJSUnit(unit.baseUnit)
      )
    : value
