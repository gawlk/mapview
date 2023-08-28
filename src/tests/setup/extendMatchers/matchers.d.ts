// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'

interface CustomMatchers<R = unknown> {
  toBeSameLineOrder(expected: File | string): R
  toBeSameValue(expected: File): R
  toBeSameZip(expected: File): R
  toHaveSameJSON(expected: Unzipped): R
  toHaveSameRawData(expected: Unzipped): R
  toHaveSameScreenshots(expected: Unzipped): R
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface Assertion extends CustomMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
