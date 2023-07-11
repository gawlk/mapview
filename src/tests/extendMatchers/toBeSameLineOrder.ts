import { expect } from 'vitest'

import { getKey } from '../utils'
import { filesToStringArray } from '../utils/text'

interface CustomMatchers<R = unknown> {
  toBeSameLineOrder(expected: File | string): R
}

export const toBeSameLineOrder = async (
  actual: File | string,
  expected: File | string
) => {
  const [actualLignes, expectedLignes] = (await filesToStringArray(
    [actual, expected],
    { removeBlankLine: true }
  )) as string[][]

  if (actualLignes.length !== expectedLignes.length) {
    return {
      message: () => "Files lines isn't the same amount",
      pass: false,
    }
  }

  let sameOrder = true

  for (let i = 0; i < actualLignes.length && sameOrder; i++) {
    sameOrder =
      sameOrder && getKey(actualLignes[i]) === getKey(expectedLignes[i])
  }

  return {
    message: () => `Received Files ${sameOrder ? 'is' : "isn't"} in same order`,
    pass: sameOrder,
  }
}

expect.extend({
  toBeSameLineOrder,
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
