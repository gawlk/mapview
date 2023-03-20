import { expect } from 'vitest'

import { getFileFromPath } from './export.test'

const possibleExtension = ['pdx', 'f25', 'fwd', 'mvrz']

interface checkOpt {
  sameSize?: boolean
  sameType?: boolean
}

const defaultOpt: checkOpt = {
  sameType: true,
}

async function testFile(fileToTest: File) {
  const namePart = fileToTest.name.split('.')
  expect(namePart.length).toBeGreaterThan(0)

  const extension = namePart[namePart.length - 1]

  expect(extension).toBeDefined()
  expect(possibleExtension).toContain(extension)

  switch (extension) {
    case 'pdx':
      checkFileContent(
        fileToTest,
        await getFileFromPath('/files/Demo_Heavydyn_FR.pdx')
      )
  }
}

function readTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Le contenu du fichier est invalide.'))
      }
    }
    reader.onerror = () => {
      reject(
        new Error("Une erreur s'est produite lors de la lecture du fichier.")
      )
    }
    reader.readAsText(file)
  })
}

async function checkFileContent(
  file: File,
  refFile: File,
  opt: checkOpt = defaultOpt
) {
  if (opt.sameSize) {
    expect(file.length).toEqual(refFile.length)
  }

  if (opt.sameType) {
    expect(file.type, refFile.type)
  }

  console.log('test', typeof file.text())

  // const [contentToTest, RefContent] = await Promise.all([
  //   readTextFromFile(file),
  //   readTextFromFile(refFile),
  // ])
}

export { testFile }
