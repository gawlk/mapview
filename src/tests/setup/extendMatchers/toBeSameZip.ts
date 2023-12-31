import { unzipSync } from 'fflate'
import { expect } from 'vitest'

const toBeSameZip = async (actual: File, expected: File) => {
  const data = new Uint8Array(await actual.arrayBuffer())

  expect(() => unzipSync(data)).not.toThrowError('invalid zip data')

  const expectedData = new Uint8Array(await expected.arrayBuffer())

  const unzippedContent = unzipSync(data)
  const unzippedExpected = unzipSync(expectedData)

  expect(unzippedContent).toHaveSameRawData(unzippedExpected)
  expect(unzippedContent).toHaveSameScreenshots(unzippedExpected)
  expect(unzippedContent).toHaveSameJSON(unzippedExpected)

  return {
    message: () => 'something unknown happened', // can't be false so if this message show I can't help you
    pass: true,
  }
}

expect.extend({
  toBeSameZip,
})
