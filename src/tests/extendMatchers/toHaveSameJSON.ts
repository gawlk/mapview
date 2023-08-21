/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-namespace */

/* eslint-disable sonarjs/no-duplicate-string */
import { expect } from 'vitest'

import { unzippedToObject } from '/src/scripts'

import { checkDataConformity } from '../utils/data'

export const toHaveSameJSON = (
  actual: Fflate.Unzipped,
  expected: Fflate.Unzipped,
) => {
  const actualJson = unzippedToObject(actual)
  const expectedJson = unzippedToObject(expected)

  const { message, keys, actualData, expectedData, diff } = browseCheckData(
    actualJson,
    expectedJson,
    ['root'],
  )

  let matcherMessage: string

  const keysString = keys.join(' > ')

  switch (message) {
    case 'dataType differ':
      matcherMessage = `for ${keysString}, data type differ (${String(
        expectedData,
      )}: ${typeof expectedData}, ${String(actualData)}: ${typeof actualData})`
      break
    case 'invalid Date':
      matcherMessage = `Date differ for "${keysString}" (${String(
        expectedData,
      )}, ${String(actualData)})`
      break
    case 'invalid Number':
      matcherMessage = `number differ for "${keysString}" (${String(
        expectedData,
      )}, ${String(actualData)})`
      break
    case 'invalid date format':
      matcherMessage = `Date format of "${keysString}" is invalid ${String(
        actualData,
      )}`
      break
    case 'invalid data':
      matcherMessage = `for "${keysString}" value differ (${String(
        expectedData,
      )}, ${String(actualData)})`
      break
    case "json key's differ":
      matcherMessage = `number of key's differ ${
        keys ? `(${keys.join(',')})` : ''
      }, diff of: ${String(diff?.number)} from ${String(
        diff?.bigger,
      )} lignes (${String(diff?.keys.join(', '))})`
      break
    case 'no data':
      matcherMessage = "JSON doesn't have data"
      break
    case 'valid data':
      matcherMessage = 'Everything is valid'
      break
    case 'array data invalid': {
      const actualLength = (actualData as Array<unknown>).length
      const expectedLength = (expectedData as Array<unknown>).length

      matcherMessage = `array isn't similar for "${keysString}": ${
        expectedLength > 0 ? String(expectedData) : '[]'
      }(${expectedLength}); \n ${
        actualLength > 0 ? String(actualData) : '[]'
      }(${actualLength})`

      break
    }
    default:
      matcherMessage = 'something unexpected occurred'
  }

  return {
    message: () => matcherMessage,
    pass: message === 'valid data',
  }
}

type BrowseCheckDataMessage =
  | CheckDataConformityMessage
  | "json key's differ"
  | 'no data'

interface BrowseCheckDataResult {
  message: BrowseCheckDataMessage
  keys: string[]
  actualData?: any
  expectedData?: any
  diff?: {
    number: number
    keys: string[]
    bigger: string
  }
}

const keysToIgnore = ['arePointsLocked']

const browseCheckData = (
  actualData: any,
  expectedData: any,
  keys: string[],
  // eslint-disable-next-line sonarjs/cognitive-complexity
): BrowseCheckDataResult => {
  const actualKeys = Object.keys(actualData)
  const expectedKeys = Object.keys(expectedData)

  const actualLength = actualKeys.length
  const expectedLength = expectedKeys.length

  if (actualLength !== expectedLength) {
    const diffKeys =
      actualLength > expectedLength
        ? actualKeys.filter((key: string) => !expectedKeys.includes(key))
        : expectedKeys.filter((key: string) => !actualKeys.includes(key))

    return {
      message: "json key's differ",
      keys,
      diff: {
        number: diffKeys.length,
        keys: diffKeys,
        bigger: actualLength > expectedLength ? 'actual' : 'expected',
      },
    }
  }

  let isIdentical = true
  let lastData: BrowseCheckDataResult = {
    message: 'no data',
    keys,
  }

  for (let i = 0; i < expectedKeys.length && isIdentical; i++) {
    const key = expectedKeys[i]
    const updatedKeys = [...keys, key]

    if (!keysToIgnore.includes(key)) {
      const currentActualData = actualData[key]
      const currentExpectedData = expectedData[key]

      if (
        currentExpectedData instanceof Object &&
        !(currentExpectedData instanceof Array)
      ) {
        lastData = browseCheckData(
          currentActualData,
          currentExpectedData,
          updatedKeys,
        )

        isIdentical = lastData.message === 'valid data'
      } else if (currentExpectedData instanceof Array) {
        if (currentExpectedData.length !== currentActualData.length) {
          isIdentical = false
          lastData.message = 'array data invalid'
          lastData.actualData = currentActualData
          lastData.expectedData = currentExpectedData
          lastData.keys = updatedKeys
        } else {
          isIdentical = currentExpectedData.every((data, index) => {
            if (data instanceof Object) {
              lastData = browseCheckData(
                data,
                currentActualData[index],
                updatedKeys,
              )
              return lastData.message === 'valid data'
            }

            return (
              checkDataConformity(data, currentActualData[index]) ===
              'valid data'
            )
          })
        }
      } else {
        const resultMessage = checkDataConformity(
          currentActualData,
          currentExpectedData,
        )

        isIdentical = resultMessage === 'valid data'

        lastData = {
          keys: updatedKeys,
          actualData: currentActualData,
          expectedData: currentExpectedData,
          message: resultMessage,
        }
      }
    }
  }

  return lastData
}

expect.extend({
  toHaveSameJSON,
})
