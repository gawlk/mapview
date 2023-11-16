import { readFileSync } from 'fs'

interface CompareFilesOptions {
  filter?: string
}

export const getFileFromPath = (path: string) => {
  const buffer = readFileSync(path)

  return new File([buffer], path.split('/').pop() as string)
}

const filesToIgnore = ['.DS_Store']

export const compareFiles = (
  actual: Unzipped,
  expected: Unzipped,
  options?: CompareFilesOptions,
) => {
  let actualKeys = Object.keys(actual).filter(
    (key) => !filesToIgnore.some((file) => key.endsWith(file)),
  )
  let expectedKeys = Object.keys(expected).filter(
    (key) => !filesToIgnore.some((file) => key.endsWith(file)),
  )

  if (options?.filter) {
    const optionsFilter = options.filter
    actualKeys = actualKeys.filter((key) => key.includes(optionsFilter))
    expectedKeys = expectedKeys.filter((key) => key.includes(optionsFilter))
  }

  if (actualKeys.length !== expectedKeys.length) {
    return {
      isSameLength: false,
      actualKeys,
      expectedKeys,
      actualLength: actualKeys.length,
      expectedLength: expectedKeys.length,
    }
  }

  let haveSameFile = true
  let haveSameContent = true
  let lastKey = ''

  for (let i = 0; i < actualKeys.length && haveSameContent; i++) {
    const key = actualKeys[i]

    lastKey = key

    haveSameFile = expectedKeys.includes(key)

    haveSameContent =
      haveSameFile && actual[key].toString() === expected[key].toString()
  }

  return {
    haveSameFile,
    haveSameContent,
    lastKey,
    actualKeys,
    expectedKeys,
    isSameLength: true,
  }
}
