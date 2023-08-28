import { expect } from 'vitest'

import { compareFiles } from '/src/tests'

export const toHaveSameScreenshots = (actual: Unzipped, expected: Unzipped) => {
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
  toHaveSameScreenshots,
})
