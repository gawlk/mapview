import { Unzipped } from 'fflate'
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toHaveSameRawData(expected: Unzipped): R
}

export const toHaveSameRawData = (actual: Unzipped, expected: Unzipped) => {
  const actualKeys = Object.keys(actual).filter((key) =>
    key.includes('rawdata')
  )
  const expectedKeys = Object.keys(expected).filter((key) =>
    key.startsWith('rawdata/')
  )

  if (actualKeys.length != expectedKeys.length) {
    return {
      message: () => "number of rawData isn't the same",
      pass: false,
    }
  }

  let hasSameFile = true
  let hasSameContent = true
  let lastKeys: string = ''

  for (let i = 0; i < actualKeys.length && hasSameContent && hasSameFile; i++) {
    const key = actualKeys[i]

    lastKeys = key

    hasSameFile = hasSameFile && expectedKeys.includes(key)

    hasSameContent =
      hasSameContent &&
      hasSameFile &&
      actual[key].toString() === expected[key].toString()
  }

  if (!hasSameFile) {
    return {
      message: () =>
        `rawData files are different ${lastKeys} isn't present in expected`,
      pass: false,
    }
  }

  return {
    message: () =>
      `${hasSameContent ? 'have' : "haven't"} same data: ${lastKeys}`,
    pass: hasSameContent,
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
