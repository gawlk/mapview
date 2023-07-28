/* eslint-disable @typescript-eslint/no-namespace */
import { expect } from 'vitest'

import { filesToStringArray, isValidDate, parseData } from '../utils'
import { checkNumericValue } from '../utils/data'

export const toBeSameValue = async (
  actual: File | string,
  expected: File | string
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const [actualLignes, expectedLignes] = (await filesToStringArray(
    [actual, expected],
    { removeBlankLine: true, dataType: 'combos' }
  )) as KeyValueData[][]

  if (actualLignes.length !== expectedLignes.length) {
    return {
      message: () => "Files lines isn't the same amount",
      pass: false,
    }
  }

  let allValueIsIdentical = true

  const lastValues: ReturnType<typeof parseData>[] = []

  for (let i = 0; i < actualLignes.length && allValueIsIdentical; i++) {
    const actualLigne = actualLignes[i]
    const expectedLigne = expectedLignes[i]

    const actualValue = parseData(actualLigne.value)
    const expectedValue = parseData(expectedLigne.value)

    lastValues[0] = `${actualLigne.key}: ${actualLigne.value}`
    lastValues[1] = `${expectedLigne.key}: ${expectedLigne.value}`

    if (typeof actualValue !== typeof expectedValue) {
      return {
        message: () =>
          `Values aren't of the same type: ${actualLigne.key}, ${
            expectedLigne.key
          }: (${String(actualValue)}; ${String(expectedValue)})`,
        pass: false,
      }
    }

    if (typeof actualValue === 'number' && typeof expectedValue === 'number') {
      allValueIsIdentical =
        allValueIsIdentical && checkNumericValue(actualValue, expectedValue)
    } else if (
      typeof actualValue === 'object' &&
      Object.hasOwn(actualValue, 'date') &&
      Object.hasOwn(actualValue, 'origin') &&
      typeof expectedValue === 'object' &&
      Object.hasOwn(expectedValue, 'date')
    ) {
      const parsed = expectedValue as ParsedDate

      if (!isValidDate(parsed)) {
        return {
          message: () => `Date isn't valid: (${parsed.origin})`,
          pass: false,
        }
      }

      allValueIsIdentical =
        allValueIsIdentical &&
        (actualValue as ParsedDate).date.getTime() === parsed.date.getTime()
    } else if (Array.isArray(actualValue) && Array.isArray(expectedValue)) {
      allValueIsIdentical =
        allValueIsIdentical &&
        actualValue.every((value, index) => {
          const exp = expectedValue[index]
          const valueType = typeof value
          const expType = typeof exp

          return (
            valueType === expType &&
            (valueType === 'number' && expType === 'number'
              ? checkNumericValue(value as number, exp as number)
              : value === exp)
          )
        })
    } else {
      allValueIsIdentical = actualValue === expectedValue
    }
  }

  return {
    message: () =>
      `Values ${
        allValueIsIdentical ? 'are' : 'are not'
      } equal (${lastValues.join(',')})`,
    pass: allValueIsIdentical,
  }
}

expect.extend({
  toBeSameValue,
})
