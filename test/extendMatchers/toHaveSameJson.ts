import { checkDataConformity } from 'test/utils/data'
import { expect } from 'vitest'

import { unzippedToObject } from '/src/scripts'

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
      matcherMessage = `for ${key}, data type differ (${actualData}: ${typeof actualData}, ${expectedData}: ${typeof expectedData})`
      break
    case 'invalid Date':
      matcherMessage = `Date differ for "${key}" (${actualData}, ${expectedData})`
      break
    case 'invalid Number':
      matcherMessage = `number differ for "${key}" (${actualData}, ${expectedData})`
      break
    case 'invalid date format':
      matcherMessage = `Date format of "${key}" is invalid ${actualData}`
      break
    case 'invalid data':
      matcherMessage = `for "${key}" value differ (${actualData}, ${expectedData})`
      break
    case "json key's differ":
      matcherMessage = `number of key's differ${
        key ? ` (${key})` : ''
      }, diff of: ${diff} lignes`
      break
    case 'no data':
      matcherMessage = "JSON doesn't have data"
      break
    case 'valid data':
      matcherMessage = 'Every thing is ok'
      break
    case 'array data invalid':
      matcherMessage = `array isn't similar for "${key}": ([${actualData}]; [${expectedData}])`
      break
    default:
      matcherMessage = 'something unexpected occurred'
  }

  return {
    message: () => matcherMessage,
    pass: message === 'valid data',
  }
}

type browseCheckDataMessage =
  | ReturnType<typeof checkDataConformity>
  | "json key's differ"
  | 'no data'

interface browseCheckDataResult {
  message: browseCheckDataMessage
  key?: string
  actualData?: any
  expectedData?: any
  diff?: number
}

const browseCheckData = (
  actualData: any,
  expectedData: any
): browseCheckDataResult => {
  const actualKeys = Object.keys(actualData)
  const expectedKeys = Object.keys(expectedData)

  if (actualKeys.length !== expectedKeys.length) {
    return {
      message: "json key's differ",
      diff: Math.abs(actualKeys.length - expectedKeys.length),
    }
  }

  let isIdentical = true
  let resultMessage: browseCheckDataMessage = 'no data'
  let lastData: browseCheckDataResult = {
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
