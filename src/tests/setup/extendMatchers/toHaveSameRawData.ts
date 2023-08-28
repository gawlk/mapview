import { expect } from 'vitest'

import { compareFiles } from '/src/tests'

const toHaveSameRawData = (actual: Unzipped, expected: Unzipped) => {
  const compareResult = compareFiles(actual, expected, { filter: 'rawdata/' })
  const { lastKey, haveSameContent } = compareResult

  if (!compareResult.isSameLength) {
    return {
      message: () =>
        `number of rawData aren't the same: (${String(
          compareResult.actualLength,
        )}, ${String(compareResult.expectedLength)})`,
      pass: false,
    }
  }

  if (!compareResult.haveSameFile) {
    return {
      message: () =>
        `rawData files are different ${String(
          lastKey,
        )} isn't present in expected`,
      pass: false,
    }
  }

  return {
    message: () =>
      `${haveSameContent ? 'have' : "haven't"} same data ${
        haveSameContent ? '' : `: ${String(lastKey)}`
      }`,
    pass: !!haveSameContent,
  }
}

expect.extend({
  toHaveSameRawData,
})
