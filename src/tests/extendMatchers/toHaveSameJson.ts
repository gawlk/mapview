/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-namespace */

/* eslint-disable sonarjs/no-duplicate-string */
import { expect } from 'vitest'

import { unzippedToObject } from '/src/scripts'

import { checkDataConformity } from '../utils/data'

interface CustomMatchers<R = unknown> {
  toHaveSameJson(expected: Fflate.Unzipped): R
}

export const toHaveSameJson = (
  actual: Fflate.Unzipped,
  expected: Fflate.Unzipped
) => {
  const actualJson = unzippedToObject(actual)
  const expectedJson = unzippedToObject(expected)

  const { message, key, actualData, expectedData, diff } = browseCheckData(
    actualJson,
    expectedJson
  )

  let matcherMessage: string

  switch (message) {
    case 'dataType differ':
      matcherMessage = `for ${String(key)}, data type differ (${String(
        actualData
      )}: ${typeof actualData}, ${String(
        expectedData
      )}: ${typeof expectedData})`
      break
    case 'invalid Date':
      matcherMessage = `Date differ for "${String(key)}" (${String(
        actualData
      )}, ${String(expectedData)})`
      break
    case 'invalid Number':
      matcherMessage = `number differ for "${String(key)}" (${String(
        actualData
      )}, ${String(expectedData)})`
      break
    case 'invalid date format':
      matcherMessage = `Date format of "${String(key)}" is invalid ${String(
        actualData
      )}`
      break
    case 'invalid data':
      matcherMessage = `for "${String(key)}" value differ (${String(
        actualData
      )}, ${String(expectedData)})`
      break
    case "json key's differ":
      matcherMessage = `number of key's differ${
        key ? ` (${key})` : ''
      }, diff of: ${String(diff?.number)} from ${String(
        diff?.bigger
      )} lignes (${String(diff?.keys.join(', '))})`
      break
    case 'no data':
      matcherMessage = "JSON doesn't have data"
      break
    case 'valid data':
      matcherMessage = 'Every thing is ok'
      break
    case 'array data invalid':
      matcherMessage = `array isn't similar for "${String(key)}": ([${String(
        actualData
      )}];\n [${String(expectedData)}])`
      break
    default:
      matcherMessage = 'something unexpected occurred'
  }

  return {
    message: () => matcherMessage,
    pass: message === 'valid data',
  }
}

type BrowseCheckDataMessage =
  | ReturnType<typeof checkDataConformity>
  | "json key's differ"
  | 'no data'

interface BrowseCheckDataResult {
  message: BrowseCheckDataMessage
  key?: string
  actualData?: any
  expectedData?: any
  diff?: {
    number: number
    keys: string[]
    bigger: string
  }
}

const browseCheckData = (
  actualData: any,
  expectedData: any
): BrowseCheckDataResult => {
  const actualKeys = Object.keys(actualData)
  const expectedKeys = Object.keys(expectedData)

  const actualLength = actualKeys.length
  const expectedLength = expectedKeys.length

  if (actualLength !== expectedLength) {
    const keys =
      actualLength > expectedLength
        ? actualKeys.filter((key: string) => !expectedKeys.includes(key))
        : expectedKeys.filter((key: string) => !actualKeys.includes(key))

    return {
      message: "json key's differ",
      diff: {
        number: Math.abs(actualKeys.length - expectedKeys.length),
        keys,
        bigger: actualLength > expectedLength ? 'actual' : 'expected',
      },
    }
  }

  let isIdentical = true
  let resultMessage: BrowseCheckDataMessage = 'no data'
  let lastData: BrowseCheckDataResult = {
    message: resultMessage,
  }

  for (let i = 0; i < actualKeys.length && isIdentical; i++) {
    const key = actualKeys[i]
    const currentActualData = actualData[key]
    const currentExpectedData = expectedData[key]

    if (
      currentActualData instanceof Object &&
      !(currentActualData instanceof Array)
    ) {
      lastData = browseCheckData(currentActualData, currentExpectedData)

      isIdentical = isIdentical && lastData.message === 'valid data'
    } else {
      resultMessage = checkDataConformity(
        currentActualData,
        currentExpectedData
      )

      isIdentical = isIdentical && resultMessage === 'valid data'

      lastData = {
        key,
        actualData: currentActualData,
        expectedData: currentExpectedData,
        message: resultMessage,
      }
    }
  }

  return lastData
}

expect.extend({
  toHaveSameJson,
})

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
