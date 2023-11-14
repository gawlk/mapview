import { createUnit, unit as Unit } from 'mathjs'

import { numberToLocaleString } from '/src/locales'
import { createASS } from '/src/scripts'

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
function convertMapviewUnitToMathJSUnit(unit: AnyUnit): AnyUnit {
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

type AverageFunction = 'allEqual' | 'capOutliers' | 'ignoreOutliers'

const getValueForAverage = (
  min: number,
  max: number,
  value: number,
  averageFunction?: AverageFunction,
) => {
  if (averageFunction === 'capOutliers') {
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
  name: UnitName,
  json: JSONMathUnit<PossibleUnits>,
  baseUnit: string,
  possibleSettings: [PossibleUnits, number][],
  options?: {
    possiblePrecisions?: number[]
    step?: number
    averageFunction?: AverageFunction
    readOnly?: true
    invalidReplacement?: string
    checkValidity?: (value: number) => boolean
  },
): MathUnit<PossibleUnits> => {
  const currentUnit = createASS(json.currentUnit || possibleSettings[0][0])
  const possiblePrecisions = options?.possiblePrecisions || [0, 1, 2]
  const currentPrecision = createASS(
    json.currentPrecision || possibleSettings[0][1],
  )
  const max = createASS(json.max)
  const min = createASS(json.min || 0)
  const readOnly = options?.readOnly || false
  const invalidReplacement =
    options?.invalidReplacement || defaultInvalidValueReplacement

  const mathUnits: MathUnit<PossibleUnits> = {
    name,
    baseUnit,
    possibleSettings,
    currentUnit,
    possiblePrecisions,
    currentPrecision,
    min,
    max,
    readOnly,
    capValue(value: number) {
      return Math.max(min(), Math.min(max(), value))
    },
    getAverage(values) {
      const filteredValues: number[] = values.filter(
        (value) =>
          this.checkValidity(value) &&
          (options?.averageFunction === 'ignoreOutliers'
            ? value <= max() && value >= min()
            : true),
      )

      return filteredValues.length > 0
        ? filteredValues.reduce(
            (total, currentValue) =>
              total +
              getValueForAverage(
                min(),
                max(),
                currentValue,
                options?.averageFunction,
              ),
            0,
          ) / filteredValues.length
        : 0
    },
    currentToBase(value) {
      return convertValueFromUnitAToUnitB(
        value,
        this.currentUnit(),
        this.baseUnit,
      )
    },
    baseToCurrent(value) {
      return convertValueFromUnitAToUnitB(
        value,
        this.baseUnit,
        this.currentUnit(),
      )
    },
    checkValidity(value) {
      return !Number.isNaN(value) && (options?.checkValidity?.(value) ?? true)
    },
    valueToLocaleString(value, parseOptions = {}) {
      let valueString

      if (this.checkValidity(value)) {
        const numberToLocaleOptions = {
          locale: parseOptions.locale,
          precision: parseOptions.precision,
        }

        let preString = ''

        numberToLocaleOptions.precision ??= this.currentPrecision()

        if (!parseOptions.disableMinAndMax) {
          if (value < min()) {
            value = min()
            preString = '<'
          } else if (max && value > max()) {
            value = max()
            preString = '>'
          }
        }

        value = convertValueFromUnitAToUnitB(
          value,
          this.baseUnit,
          parseOptions.unit ?? this.currentUnit(),
        )

        valueString = `${
          parseOptions.disablePreString ? '' : preString
        } ${numberToLocaleString(value, numberToLocaleOptions)}`.trim()
      } else {
        valueString = invalidReplacement
      }

      const localeString: string = `${valueString} ${
        parseOptions.appendUnitToString ? this.currentUnit() : ''
      }`.trim()

      return parseOptions.removeSpaces
        ? localeString.replaceAll(' ', '')
        : localeString
    },
    toJSON(): JSONMathUnit<PossibleUnits> {
      return {
        version: json.version,
        currentUnit: this.currentUnit(),
        currentPrecision: this.currentPrecision(),
        max: max(),
        min: min(),
      }
    },
  }

  return mathUnits
}

export const convertValueFromUnitAToUnitB = (
  value: number,
  unitA: string,
  unitB: string,
) =>
  unitA !== unitB
    ? Unit(value, convertMapviewUnitToMathJSUnit(unitA)).toNumber(
        convertMapviewUnitToMathJSUnit(unitB),
      )
    : value
