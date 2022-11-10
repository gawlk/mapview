import { unit as Unit, createUnit } from 'mathjs'

createUnit({
  cmm: '10 um',
  dmm: '100 um',
  nlbs: '4.448221628250858 N',
})

const convertMapviewUnitToMathJSUnit = (unit: string) =>
  unit === '°C'
    ? 'degC'
    : unit === '°F'
    ? 'degF'
    : unit === '1/100 mm'
    ? 'cmm'
    : unit === '1/10 mm'
    ? 'dmm'
    : unit === 'lbs'
    ? 'nlbs'
    : unit === '%'
    ? 'm'
    : unit

export const createMathUnit = <PossibleUnits extends string>(
  name: string,
  json: JSONMathUnit<PossibleUnits>,
  baseUnit: string,
  possibleSettings: [PossibleUnits, number][],
  options?: {
    possiblePrecisions?: number[]
    step?: number
    averageFunction?: 'allEqual' | 'capOutliers' | 'ignoreOutliers'
    readOnly?: true
  }
): MathUnit<PossibleUnits> => {
  const currentUnit = json.currentUnit || possibleSettings[0][0]
  const possiblePrecisions = options?.possiblePrecisions || [0, 1, 2]
  const currentPrecision = json.currentPrecision || possibleSettings[0][1]
  const max = json.max
  const min = json.min || 0
  const step = options?.step || 1
  const readOnly = options?.readOnly || false

  const mathUnit = shallowReactive({
    name,
    baseUnit,
    possibleSettings,
    currentUnit,
    possiblePrecisions,
    currentPrecision,
    min,
    max,
    step,
    readOnly,
    getAverage: function (values: number[]) {
      const min = this.min
      const max = this.max

      const filteredValues: number[] = values.filter((value) =>
        options?.averageFunction === 'ignoreOutliers'
          ? value <= this.max && value >= this.min
          : true
      )

      return filteredValues.length > 0
        ? filteredValues.reduce(
            (total, currentValue) =>
              total +
              (options?.averageFunction === 'capOutliers'
                ? max && currentValue > max
                  ? max
                  : currentValue < min
                  ? min
                  : currentValue
                : currentValue),
            0
          ) / filteredValues.length
        : 0
    },
    toJSON: function (): JSONMathUnit<PossibleUnits> {
      return {
        version: 1,
        currentUnit: this.currentUnit,
        currentPrecision: this.currentPrecision,
        max: this.max,
        min: this.min,
      }
    },
  })

  return mathUnit
}

export const convertValueFromUnitAToUnitB = (
  value: number,
  unitA: string,
  unitB: string
) =>
  unitA !== unitB
    ? Unit(value, convertMapviewUnitToMathJSUnit(unitA)).toNumber(
        convertMapviewUnitToMathJSUnit(unitB)
      )
    : value
