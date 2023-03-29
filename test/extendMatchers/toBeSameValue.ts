import { index } from 'mathjs'
import { filesToStringArray, isValidDate, parseData } from 'test/utils'
import { toFiveDecimal } from 'test/utils/number'
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeSameValue(expected: File): R
}

const checkNumericValue = (actual: number, expected: number) => {
  const preciseActual = toFiveDecimal(actual)
  const preciseExpected = toFiveDecimal(expected)

  return preciseActual === preciseExpected
}

export const toBeSameValue = async (
  actual: File | string,
  expected: File | string
) => {
  const [actualLignes, expectedLignes] = (await filesToStringArray(
    [actual, expected],
    { removeBlankLine: true, dataType: 'combos' }
  )) as combosData[][]

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
        message: () => `Values isn't same type`,
        pass: false,
      }
    }

    if (typeof actualValue === 'number' && typeof expectedValue === 'number') {
      allValueIsIdentical =
        allValueIsIdentical && checkNumericValue(actualValue, expectedValue)
    } else if (
      typeof actualValue == 'object' &&
      Object.hasOwn(actualValue, 'date') &&
      Object.hasOwn(actualValue, 'origin') &&
      typeof expectedValue === 'object' &&
      Object.hasOwn(expectedValue, 'date')
    ) {
      const parsed = expectedValue as ParsedDate

      if (!isValidDate(parsed)) {
        console.log(parsed)
        return {
          message: () => `Date isn't valid`,
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

  console.log(actual, expected)

  return {
    message: () =>
      `Values ${allValueIsIdentical ? 'is' : 'is not'} equal (${lastValues.join(
        ','
      )})`,
    pass: allValueIsIdentical,
  }
}

expect.extend({
  toBeSameValue,
})

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
