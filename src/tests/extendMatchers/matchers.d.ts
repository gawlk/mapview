import type { Assertion, AsymmetricMatchersContaining } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeSameLineOrder(expected: File | string): R
  toBeSameValue(expected: File): R
  toHaveSameJSON(expected: Fflate.Unzipped): R
  toHaveSameRawData(expected: Fflate.Unzipped): R
  toHaveSameScreenshots(expected: Fflate.Unzipped): R
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
