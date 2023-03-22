import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeSameLineOrder(expected: File | string): R
}

export const toBeSameLineOrder = async (
  actual: File | string,
  expected: File | string
) => {
  let actualText
  let expectedText

  if (typeof actual === 'string') {
    actualText = actual
  } else {
    actualText = await actual.text()
  }

  if (typeof expected === 'string') {
    expectedText = expected
  } else {
    expectedText = await expected.text()
  }

  const actualLignes = actualText
    .replace('\r', '')
    .split('\t')
    .filter((ligne) => ligne.length > 0)
  const expectedLignes = expectedText
    .replace('\r', '')
    .split('\t')
    .filter((ligne) => ligne.length > 0)

  if (actualLignes.length !== expectedLignes.length) {
    return {
      message: () => "Files lines isn't the same amount",
      pass: false,
    }
  }

  let sameOrder = true

  for (let i = 0; i < actualLignes.length && sameOrder; i++) {
    sameOrder =
      sameOrder &&
      actualLignes[i].split('=')[0].trim() ===
        expectedLignes[i].split('=')[0].trim()
  }

  return {
    message: () => `Received Files is `,
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
