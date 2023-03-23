import { fileToStringArray, getKey } from 'test/utils/'
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeSameLineOrder(expected: File | string): R
}

export const toBeSameLineOrder = async (
  actual: File | string,
  expected: File | string
) => {
  const actualLignes = await fileToStringArray(actual)
  const expectedLignes = await fileToStringArray(expected)

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
  namespace Chai {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
