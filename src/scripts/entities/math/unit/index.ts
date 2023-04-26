import { unit as Unit, createUnit } from 'mathjs'

import { numberToLocaleString } from '/src/locales'

export enum ConvertType {
  BaseToCurrent = 'BaseToCurrent',
  CurrentToBase = 'CurrentToBase',
}

createUnit({
  cmm: '10 um',
  dmm: '100 um',
  nlbs: '4.448221628250858 N',
})

export const defaultInvalidValueReplacement = '--'

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
  mathUnitOptions?: {
    possiblePrecisions?: number[]
    step?: number
    averageFunction?: 'allEqual' | 'capOutliers' | 'ignoreOutliers'
    readOnly?: true
    invalidReplacement?: string
    checkValidity?: (value: number) => boolean
  }
): MathUnit<PossibleUnits> => {
  const currentUnit = json.currentUnit || possibleSettings[0][0]
  const possiblePrecisions = mathUnitOptions?.possiblePrecisions || [0, 1, 2]
  const currentPrecision = json.currentPrecision || possibleSettings[0][1]
  const jsonMax = json.max
  const jsonMin = json.min || 0
  const readOnly = mathUnitOptions?.readOnly || false
  const invalidReplacement =
    mathUnitOptions?.invalidReplacement || defaultInvalidValueReplacement

  const mathUnit: MathUnit<PossibleUnits> = shallowReactive({
    name,
    baseUnit,
    possibleSettings,
    currentUnit,
    possiblePrecisions,
    currentPrecision,
    min: jsonMin,
    max: jsonMax,
    readOnly,
    getAverage(values) {
      const { min, max } = this

      const filteredValues: number[] = values.filter(
        (value) =>
          this.checkValidity(value) &&
          (mathUnitOptions?.averageFunction === 'ignoreOutliers'
            ? value <= max && value >= min
            : true)
      )

      return filteredValues.length > 0
        ? filteredValues.reduce(
            (total, currentValue) =>
              total +
              reduceForAverage(
                this.min,
                this.max,
                currentValue,
                mathUnitOptions
              ),
            0
          ) / filteredValues.length
        : 0
    },
    currentToBase(value) {
      return convertValueFromUnitAToUnitB(
        value,
        this.currentUnit,
        this.baseUnit
      )
    },
    baseToCurrent(value) {
      return convertValueFromUnitAToUnitB(
        value,
        this.baseUnit,
        this.currentUnit
      )
    },
    checkValidity(value) {
      return (
        !Number.isNaN(value) &&
        (mathUnitOptions?.checkValidity?.(value) ?? true)
      )
    },
    // two function with same param name
    // eslint-disable-next-line no-shadow
    valueToString(value, options = {}) {
      let valueString

      if (this.checkValidity(value)) {
        const numberToLocaleOptions = {
          locale: options.locale,
          precision: options.precision,
        }

        let preString = ''

        numberToLocaleOptions.precision ??= this.currentPrecision

        if (!options.disableMinAndMax) {
          if (value < this.min) {
            value = this.min
            preString = '<'
          } else if (this.max && value > this.max) {
            value = this.max
            preString = '>'
          }
        }

        value = convertValueFromUnitAToUnitB(
          value,
          this.baseUnit,
          options.unit ?? this.currentUnit
        )

        valueString = `${
          options.disablePreString ? '' : preString
        } ${numberToLocaleString(value, numberToLocaleOptions)}`.trim()
      } else {
        valueString = invalidReplacement
      }

      const localeString: string = `${valueString} ${
        options.appendUnitToString ? this.currentUnit : ''
      }`.trim()

      return options.removeSpaces
        ? localeString.replaceAll(' ', '')
        : localeString
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
