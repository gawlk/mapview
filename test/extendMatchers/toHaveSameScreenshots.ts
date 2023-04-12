import { Unzipped } from 'fflate'
import { compareFiles } from 'test/utils'
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toHaveSameScreenshots(expected: Unzipped): R
}

export const toHaveSameScreenshots = async (
  actual: Unzipped,
  expected: Unzipped
) => {
  const compareResult = compareFiles(actual, expected, {
    filter: 'screenshots/',
  })
  const { lastKey, haveSameContent } = compareResult

  if (!compareResult.isSameLength) {
    return {
      message: () => "number os screenshots aren't the same",
      pass: false,
    }
  }

  if (!compareResult.haveSameFile) {
    return {
      message: () =>
        `screenshots files are different ${lastKey} isn't present in expected`,
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
  toHaveSameScreenshots,
})

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
