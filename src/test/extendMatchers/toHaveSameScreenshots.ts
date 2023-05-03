import { expect } from 'vitest'

import { compareFiles } from '/src/test/utils'

interface CustomMatchers<R = unknown> {
  toHaveSameScreenshots(expected: Fflate.Unzipped): R
}

export const toHaveSameScreenshots = (
  actual: Fflate.Unzipped,
  expected: Fflate.Unzipped
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
        `screenshots files are different ${String(
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
  toHaveSameScreenshots,
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
