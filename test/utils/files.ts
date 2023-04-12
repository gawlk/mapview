import { Unzipped } from 'fflate'

interface compareFilesOptions {
  filter?: string
}

export const compareFiles = (
  actual: Unzipped,
  expected: Unzipped,
  options?: compareFilesOptions
) => {
  let actualKeys = Object.keys(actual)
  let expectedKeys = Object.keys(expected)

  if (options?.filter) {
    actualKeys = actualKeys.filter((key) =>
      key.includes(options.filter as string)
    )
    expectedKeys = expectedKeys.filter((key) =>
      key.includes(options.filter as string)
    )
  }

  if (actualKeys.length != expectedKeys.length) {
    return {
      isSameLength: false,
    }
  }

  let haveSameFile = true
  let haveSameContent = true
  let lastKey: string = ''

  for (let i = 0; i < actualKeys.length && haveSameContent; i++) {
    const key = actualKeys[i]

    lastKey = key

    haveSameFile = haveSameFile && expectedKeys.includes(key)

    haveSameContent =
      haveSameContent &&
      haveSameFile &&
      actual[key].toString() === expected[key].toString()
  }

  return {
    haveSameFile,
    haveSameContent: haveSameContent,
    lastKey,
    isSameLength: true,
  }
}
