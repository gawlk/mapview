import { unit as Unit, createUnit } from 'mathjs'

createUnit({
  cmm: '10 um',
  nlbs: '4.448221628250858 N',
})

const convertMapviewUnitToMathJSUnit = (unit: string) =>
  unit === '°C'
    ? 'degC'
    : unit === '°F'
    ? 'degF'
    : unit === '1/100 mm'
    ? 'cmm'
    : unit === 'lbs'
    ? 'nlbs'
    : unit === '%'
    ? 'm'
    : unit

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
  const max = options.max || null
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
          ? (!this.max || value <= this.max) && value >= this.min
          : true
      )

      return filteredValues.length > 0
        ? filteredValues.reduce(
            (total, currentValue) =>
              total +
              (options.averageFunction === 'capOutliers'
                ? this.max && currentValue > this.max
                  ? this.max
                  : currentValue < this.min
                  ? this.min
                  : currentValue
                : currentValue),
            0
          ) / filteredValues.length
        : 0
    },
  })
}

export const convertValueFromUnitAToUnitB = (
  value: number,
  unitA: string,
  unitB: string
) =>
  Unit(value, convertMapviewUnitToMathJSUnit(unitA)).toNumber(
    convertMapviewUnitToMathJSUnit(unitB)
  )
