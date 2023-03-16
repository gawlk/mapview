import { unit as Unit, createUnit } from 'mathjs'

// eslint-disable-next-line no-shadow
export enum ConvertType {
  BaseToCurrent = 'BaseToCurrent',
  CurrentToBase = 'CurrentToBase',
}

createUnit({
  cmm: '10 um',
  dmm: '100 um',
  nlbs: '4.448221628250858 N',
})

function convertMapviewUnitToMathJSUnit(unit: undefined): undefined
function convertMapviewUnitToMathJSUnit(unit: string): string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertMapviewUnitToMathJSUnit(unit: any): any {
  switch (unit) {
    case '°C':
      return 'degC'
    case '°F':
      return 'degF'
    case '1/100 mm':
      return 'cmm'
    case '1/10 mm':
      return 'dmm'
    case 'lbs':
      return 'nlbs'
    case '%':
      return 'm'
    default:
      return unit
  }
}

interface MathUnitOptions {
  possiblePrecisions?: number[]
  step?: number
  averageFunction?: 'allEqual' | 'capOutliers' | 'ignoreOutliers'
  readOnly?: true
}

const reduceForAverage = (
  min: number,
  max: number,
  value: number,
  options?: MathUnitOptions
) => {
  if (options?.averageFunction === 'capOutliers') {
    if (max && value > max) {
      return max
    }
    if (value < min) {
      return min
    }
  }
  return value
}

export const createMathUnit = <PossibleUnits extends string>(
  name: string,
  json: JSONMathUnit<PossibleUnits>,
  baseUnit: string,
  possibleSettings: [PossibleUnits, number][],
  options?: MathUnitOptions
): MathUnit<PossibleUnits> => {
  const currentUnit = json.currentUnit || possibleSettings[0][0]
  const possiblePrecisions = options?.possiblePrecisions || [0, 1, 2]
  const currentPrecision = json.currentPrecision || possibleSettings[0][1]
  const max = json.max
  const min = json.min || 0
  const readOnly = options?.readOnly || false

  return shallowReactive({
    name,
    baseUnit,
    possibleSettings,
    currentUnit,
    possiblePrecisions,
    currentPrecision,
    min,
    max,
    readOnly,
    getAverage(values: number[]) {
      const filteredValues: number[] = values.filter((value) =>
        options?.averageFunction === 'ignoreOutliers'
          ? value <= this.max && value >= this.min
          : true
      )

      return filteredValues.length > 0
        ? filteredValues.reduce(
            (total, currentValue) =>
              total +
              reduceForAverage(this.min, this.max, currentValue, options),
            0
          ) / filteredValues.length
        : 0
    },
    toJSON(): JSONMathUnit<PossibleUnits> {
      return {
        version: 1,
        currentUnit: this.currentUnit,
        currentPrecision: this.currentPrecision,
        max: this.max,
        min: this.min,
      }
    },
    currentToBase(value: number) {
      return convertValueFromUnitAToUnitB(
        value,
        this.currentUnit,
        this.baseUnit
      )
    },
    baseToCurrent(value: number) {
      return convertValueFromUnitAToUnitB(
        value,
        this.baseUnit,
        this.currentUnit
      )
    },
  })
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
