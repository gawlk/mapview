import { expect } from 'vitest'

const possibleExtension = ['pdx', 'f25', 'fwd', 'mvrz']

function testFile(fileToTest: File) {
  const namePart = fileToTest.name.split('.')
  expect(namePart.length).toBeGreaterThan(0)

  const extenstion = namePart[namePart.length - 1]

  expect(extenstion).toBeDefined()
  expect(possibleExtension).toContain(extenstion)

  switch (extenstion) {
    case 'pdx':
  }
}
