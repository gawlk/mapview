/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-namespace */

/* eslint-disable sonarjs/no-duplicate-string */
import { expect } from 'vitest'

import { unzippedToJSON } from '/src/scripts'
import { checkDataConformity } from '/src/tests'

const toHaveSameJSON = (actual: Unzipped, expected: Unzipped) => {
  const actualJSON = unzippedToJSON(actual)
  const expectedJSON = unzippedToJSON(expected)

  const { message, keys, actualData, expectedData, diff } = browseCheckData(
    actualJSON,
    expectedJSON,
    ['root'],
  )

  let matcherMessage: string

  const keysString = keys.join(' > ')

  switch (message) {
    case 'dataType differ':
      matcherMessage = `for ${keysString}, data type differ:\nExpected:\n${String(
        expectedData,
      )}: ${typeof expectedData}\nActual:\n${String(
        actualData,
      )}: ${typeof actualData}`
      break
    case 'invalid Date':
      matcherMessage = `Date differ for "${keysString}"\nExpected:\n${String(
        expectedData,
      )}\nActual:\n${String(actualData)}`
      break
    case 'invalid Number':
      matcherMessage = `number differ for "${keysString}"\nExpected:\n${String(
        expectedData,
      )}\nActual:\n${String(actualData)})`
      break
    case 'invalid date format':
      matcherMessage = `Date format of "${keysString}" is invalid ${String(
        actualData,
      )}`
      break
    case 'invalid data':
      matcherMessage = `Found different values\nPath:"${keysString}"\nExpected:\n${String(
        expectedData,
      )}\nFound:\n${String(actualData)}`
      break
    case "json key's differ":
      {
        let diffString = ''
        const joinSeparator = ',\n\t'

        switch (diff?.bigger) {
          case 'expected':
            diffString = `missing key(s) (${diff.missing.length}):
            [\n\t${String(diff.missing.join(joinSeparator))}\n]`

            break
          case 'actual':
            diffString = `unexpected key(s) (${diff.unexpected.length}):
            [\n\t${String(diff.unexpected.join(joinSeparator))}\n]`

            break
          case 'none':
            diffString = `keys:\nMissing (${
              diff.missing.length
            }):\n[\n\t${diff.missing.join(joinSeparator)}\n]\nUnexpected (${
              diff.unexpected.length
            }):\n[\n\t${diff.unexpected.join(joinSeparator)}\n]`

            break
        }

        matcherMessage = `Keys of JSON differ\nPath: ${keysString}\n${diffString}`
      }
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

      matcherMessage = `Different arrays were found\nPath: ${keysString}\nExpected: ${
        expectedLength > 0 ? String(expectedData) : '[]'
      } (${expectedLength})\nFound: ${
        actualLength > 0 ? String(actualData) : '[]'
      } (${actualLength})`

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
  diff?:
    | BrowseCheckDataResultDiffActual
    | BrowseCheckDataResultDiffExpected
    | BrowseCheckDataResultDiffNone
}

interface BrowseCheckDataResultDiffExpected {
  missing: string[]
  bigger: 'expected'
}

interface BrowseCheckDataResultDiffNone {
  missing: string[]
  unexpected: string[]
  bigger: 'none'
}

interface BrowseCheckDataResultDiffActual {
  unexpected: string[]
  bigger: 'actual'
}

const keysToIgnore = ['arePointsLocked', 'readOnly']

const browseCheckData = (
  actualData: any,
  expectedData: any,
  keys: string[],
  // eslint-disable-next-line sonarjs/cognitive-complexity
): BrowseCheckDataResult => {
  // TEMP: Remove filter after update of the tested files
  const actualKeys = Object.keys(actualData).filter(
    (key) => !keysToIgnore.includes(key),
  )
  const expectedKeys = Object.keys(expectedData).filter(
    (key) => !keysToIgnore.includes(key),
  )

  const actualLength = actualKeys.length
  const expectedLength = expectedKeys.length

  if (actualLength !== expectedLength) {
    return {
      message: "json key's differ" as const,
      keys,
      diff:
        actualLength > expectedLength
          ? {
              bigger: 'actual' as const,
              unexpected: expectedKeys.filter(
                (key: string) => !actualKeys.includes(key),
              ),
            }
          : {
              bigger: 'expected' as const,
              missing: actualKeys.filter(
                (key: string) => !expectedKeys.includes(key),
              ),
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

    if (!actualKeys.includes(key)) {
      return {
        message: "json key's differ" as const,
        keys: updatedKeys,
        diff: {
          missing: expectedKeys.filter((k) => !actualKeys.includes(k)),
          unexpected: actualKeys.filter((k) => !expectedKeys.includes(k)),
          bigger: 'none' as const,
        },
      }
    }

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
