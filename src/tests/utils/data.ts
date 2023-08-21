/* eslint-disable sonarjs/no-duplicate-string */
import { isValidDate, isValidDateFormat } from './date'
import { roundToMicroValue } from './number'

export const checkNumericValue = (actual: number, expected: number) => {
  const preciseActual = roundToMicroValue(actual)
  const preciseExpected = roundToMicroValue(expected)

  return preciseActual === preciseExpected
}

export const checkDataConformity = (
  actualData: number | Date | string,
  expectedData: number | Date | string,
) => {
  if (typeof actualData !== typeof expectedData) {
    return 'dataType differ'
  }

  if (
    typeof actualData === 'number' &&
    typeof expectedData === 'number' &&
    !checkNumericValue(actualData, expectedData)
  ) {
    return 'invalid Number'
  }

  if (
    actualData instanceof Date &&
    expectedData instanceof Date &&
    actualData.getTime() !== expectedData.getTime()
  ) {
    return 'invalid Date'
  }

  if (
    typeof expectedData === 'string' &&
    !Number.isNaN(Date.parse(expectedData)) &&
    typeof actualData === 'string' &&
    !Number.isNaN(Date.parse(actualData)) &&
    isValidDateFormat(expectedData)
  ) {
    if (!isValidDate(actualData)) {
      return 'invalid date format'
    }

    const actualTime = new Date(actualData).getTime()

    const expectedTime = new Date(expectedData).getTime()

    if (actualTime !== expectedTime) {
      return 'invalid Date'
    }
  }

  if (actualData !== expectedData) return 'invalid data'

  return 'valid data'
}
