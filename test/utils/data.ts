import { isValidDate, isValidDateFormat } from './date'
import { toXDecimal } from './number'

export const checkNumericValue = (actual: number, expected: number) => {
  const preciseActual = toXDecimal(actual)
  const preciseExpected = toXDecimal(expected)

  return preciseActual === preciseExpected
}

export const checkDataConformity = (
  actualData: unknown,
  expectedData: unknown
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
    (actualData &&
      expectedData &&
      typeof actualData == 'object' &&
      Object.hasOwn(actualData, 'date') &&
      Object.hasOwn(actualData, 'origin') &&
      typeof expectedData === 'object' &&
      Object.hasOwn(expectedData, 'date')) ||
    (typeof expectedData === 'string' &&
      !isNaN(Date.parse(expectedData)) &&
      typeof actualData === 'string' &&
      !isNaN(Date.parse(actualData)) &&
      isValidDateFormat(expectedData))
  ) {
    if (!isValidDate(actualData as ParsedDate | string)) {
      return 'invalid date format'
    }

    const actualTime = (
      typeof actualData === 'string'
        ? new Date(actualData)
        : (actualData as ParsedDate).date
    ).getTime()

    const expectedTime = (
      typeof expectedData === 'string'
        ? new Date(expectedData)
        : (expectedData as ParsedDate).date
    ).getTime()

    if (actualTime !== expectedTime) {
      return 'invalid Date'
    }
  }

  if (Array.isArray(actualData) && Array.isArray(expectedData)) {
    let arrayIsOk = true

    actualData.forEach((value, index) => {
      const exp = expectedData[index]

      arrayIsOk = arrayIsOk && checkDataConformity(value, exp) === 'valid data'
    })

    return arrayIsOk ? 'valid data' : 'array data invalid'
  }

  if (actualData !== expectedData) return 'invalid data'

  return 'valid data'
}
