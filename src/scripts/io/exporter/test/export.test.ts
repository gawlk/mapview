import { readFileSync, readdirSync, statSync } from 'fs'
import { describe, expect, test } from 'vitest'

import { importFile } from '/src/scripts'

import { heavydynPDXExporter } from '../report/heavydyn/pdx'

export const getFileFromPath = async (path: string) => {
  const buffer = readFileSync(path)

  return new File([buffer], path.split('/').pop() as string)
}

interface MPVZTestData {
  file: File
  project: Awaited<ReturnType<typeof importFile>>
}

interface filesGroup {
  directoryName: string
  pdx: File
  mvrz: File
  fwdd: File
  fwds: File
  f25: File
  mpvz: MPVZTestData
  [key: string]: MPVZTestData | File | string
}

const exportFile = async (dirPath: string, folderName?: string) => {
  const files = readdirSync(dirPath)
  const filesGroup: Partial<filesGroup> = { directoryName: folderName }
  const filesGroups: filesGroup[] = []

  let onlyFolder = true

  for (const fileName of files) {
    const part = fileName.split('.')
    const extension = part[part.length - 1]

    const subPath = `${dirPath}/${fileName}`
    const stats = statSync(subPath)

    if (stats.isFile()) {
      onlyFolder = false
      const file = await getFileFromPath(subPath)

      switch (extension) {
        case 'mpvz':
          const prjt = await importFile(file)
          filesGroup.mpvz = {
            file: file,
            project: prjt,
          }
          break
        case 'fwd':
          fileName.toLowerCase().includes('sweco')
            ? (filesGroup.fwds = file)
            : (filesGroup.fwdd = file)
          break
        default:
          filesGroup[extension] = file
      }
    } else if (stats.isDirectory()) {
      filesGroups.push(
        ...(await exportFile(
          subPath,
          `${folderName || ''}${folderName ? '/' : ''}${fileName}`
        ))
      )
    }
  }

  return onlyFolder ? filesGroups : [filesGroup as filesGroup, ...filesGroups]
}

describe('Test exports', async () => {
  const testData: filesGroup[] = []

  const path = `${__dirname}/files`
  const files = readdirSync(path)

  for (const file of files) {
    const subPath = `${path}/${file}`
    const stats = statSync(subPath)

    if (stats.isDirectory()) {
      testData.push(...(await exportFile(subPath, file)))
    }
  }

  test.each(
    testData.map((data) => [data.directoryName, data.mpvz.project, data.pdx])
  )('test pdx: %s', async (_, project, expected) => {
    const pdxFile = await heavydynPDXExporter.export(project as HeavydynProject)
    expect(pdxFile).toBeDefined()
    await expect(pdxFile).toBeSameLineOrder(expected)
  })
})
