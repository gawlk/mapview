import { expect } from 'vitest'

import { compareFiles } from '/src/tests'

const toHaveSameRawData = (actual: Unzipped, expected: Unzipped) => {
  const compareResult = compareFiles(actual, expected, { filter: 'rawdata/' })
  const {
    lastKey,
    haveSameContent,
    expectedLength,
    isSameLength,
    actualLength,
    haveSameFile,
  } = compareResult

  if (!isSameLength) {
    return {
      message: () =>
        `number of rawData is different: (${String(actualLength)}, ${String(
          expectedLength,
        )})`,
      pass: false,
    }
  }

  if (!haveSameFile) {
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
