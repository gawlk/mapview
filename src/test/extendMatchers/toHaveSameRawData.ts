import { expect } from 'vitest'

import { compareFiles } from '/src/test/utils'

interface CustomMatchers<R = unknown> {
  toHaveSameRawData(expected: Fflate.Unzipped): R
}

export const toHaveSameRawData = (
  actual: Fflate.Unzipped,
  expected: Fflate.Unzipped
) => {
  const compareResult = compareFiles(actual, expected, { filter: 'rawdata/' })
  const { lastKey, haveSameContent } = compareResult

  if (!compareResult.isSameLength) {
    return {
      message: () =>
        `number of rawData aren't the same: (${String(
          compareResult.actualLength
        )}, ${String(compareResult.expectedLength)})`,
      pass: false,
    }
  }

  if (!compareResult.haveSameFile) {
    return {
      message: () =>
        `rawData files are different ${String(
          lastKey
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
