/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-namespace */

/* eslint-disable sonarjs/no-duplicate-string */
import { expect } from 'vitest'

import { unzippedToObject } from '/src/scripts'
import { checkDataConformity } from '/src/tests'

const toHaveSameJSON = (actual: Fflate.Unzipped, expected: Fflate.Unzipped) => {
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
      matcherMessage = `Found different values\nPath:"${keysString}"\nExpected: ${String(
        expectedData,
      )}\nFound: ${String(actualData)}`
      break
    case "json key's differ":
      matcherMessage = `Number of keys differ
Path: ${keys.join(',')}
${diff?.number} ${
        diff?.bigger === 'expected' ? 'missing' : 'unexpected'
      } key(s):
[${String(diff?.keys.join(', '))}]`
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

      matcherMessage = `Different arrays were found
Path: ${keysString}
Expected: ${
        expectedLength > 0 ? String(expectedData) : '[]'
      } (${expectedLength})
Found: ${actualLength > 0 ? String(actualData) : '[]'} (${actualLength})`

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
    actualKeys: string[]
    expectedKeys: string[]
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
        actualKeys,
        expectedKeys,
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

      if (Array.isArray(currentExpectedData)) {
        if (currentExpectedData.length !== currentActualData.length) {
          isIdentical = false
          lastData.message = 'array data invalid'
          lastData.actualData = currentActualData
          lastData.expectedData = currentExpectedData
          lastData.keys = updatedKeys
        } else {
          isIdentical = currentExpectedData.every((data, index) => {
            let message: string

            if (data instanceof Object) {
              lastData = browseCheckData(data, currentActualData[index], [
                ...updatedKeys,
                index.toString(),
              ])

              message = lastData.message
            } else {
              lastData.keys = [...updatedKeys, index.toString()]

              message = checkDataConformity(data, currentActualData[index])
            }

            return message === 'valid data'
          })
        }
      } else if (currentExpectedData instanceof Object) {
        lastData = browseCheckData(
          currentActualData,
          currentExpectedData,
          updatedKeys,
        )

        isIdentical = lastData.message === 'valid data'
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
