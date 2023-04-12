import { Unzipped } from 'fflate'
import { compareFiles } from 'test/utils'
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toHaveSameRawData(expected: Unzipped): R
}

export const toHaveSameRawData = (actual: Unzipped, expected: Unzipped) => {
  const compareResult = compareFiles(actual, expected, { filter: 'rawdata/' })
  const { lastKey, haveSameContent } = compareResult

  if (!compareResult.isSameLength) {
    return {
      message: () => "number of rawData aren't the same",
      pass: false,
    }
  }

  if (!compareResult.haveSameFile) {
    return {
      message: () =>
        `rawData files are different ${lastKey} isn't present in expected`,
      pass: false,
    }
  }

  return {
    message: () =>
      `${haveSameContent ? 'have' : "haven't"} same data ${
        haveSameContent ? '' : `: ${lastKey}`
      }`,
    pass: !!haveSameContent,
  }
}

expect.extend({
  toHaveSameRawData,
})

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
