// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeSameLineOrder(expected: File | string): R
  toBeSameValue(expected: File): R
  toHaveSameJSON(expected: Fflate.Unzipped): R
  toHaveSameRawData(expected: Fflate.Unzipped): R
  toHaveSameScreenshots(expected: Fflate.Unzipped): R
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface Assertion extends CustomMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
