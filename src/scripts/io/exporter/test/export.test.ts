import { readFileSync, readdirSync, statSync } from 'fs'
import { heavydynDynatestExporter } from 'src/scripts/io/exporter/report/heavydyn/dynatest/index'
import { heavydynF25Exporter } from 'src/scripts/io/exporter/report/heavydyn/f25/index'
import { heavydynPDXExporter } from 'src/scripts/io/exporter/report/heavydyn/pdx'
import { heavydynSwecoExporter } from 'src/scripts/io/exporter/report/heavydyn/sweco/index'
import { filesToString } from 'test/utils/text'
import { describe, expect, test } from 'vitest'

import { importFile } from '/src/scripts'

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
  F25: File
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

    if (stats.isFile() && fileName != '.DS_Store') {
      onlyFolder = false
      const file = await getFileFromPath(subPath)

      switch (extension) {
        case 'mpvz':
          const project = await importFile(file)
          project?.addToMap()
          filesGroup.mpvz = {
            file: file,
            project,
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

  await Promise.all(
    files.map(async (file) => {
      const subPath = `${path}/${file}`
      const stats = statSync(subPath)

      if (stats.isDirectory()) {
        testData.push(...(await exportFile(subPath, file)))
      }
    })
  )

  test.each(
    testData.map((data) => [data.directoryName, data.mpvz.project, data.pdx])
  )('test PDX: %s', async (_, project, expected) => {
    const pdxFile = await heavydynPDXExporter.export(project as HeavydynProject)
    expect(pdxFile).toBeDefined()
    await expect(pdxFile).toBeSameLineOrder(expected)
    await expect(pdxFile).toBeSameValue(expected)
  })

  test.each(
    testData.map((data) => [data.directoryName, data.mpvz.project, data.fwds])
  )('test FWD (Sweco): %s', async (_, project, expected) => {
    const swecoFile = await heavydynSwecoExporter.export(
      project as HeavydynProject
    )

    expect(swecoFile).toBeDefined()

    const [actualLignes, expectedLignes] = await filesToString([
      swecoFile,
      expected,
    ])

    expect(actualLignes).toEqual(expectedLignes)
  })

  test.each(
    testData.map((data) => [data.directoryName, data.mpvz.project, data.fwdd])
  )('test FWD (Dynatest): %s', async (_, project, expected) => {
    const dynatestFile = await heavydynDynatestExporter.export(
      project as HeavydynProject
    )

    expect(dynatestFile).toBeDefined()

    const [actualLignes, expectedLignes] = await filesToString([
      dynatestFile,
      expected,
    ])

    expect(actualLignes).toEqual(expectedLignes)
  })

  console.log(testData)

  test.each(
    testData.map((data) => [data.directoryName, data.mpvz.project, data.F25])
  )('test F25: %s', async (_, project, expected) => {
    const f25File = await heavydynF25Exporter.export(project as HeavydynProject)

    expect(f25File).toBeDefined()

    const [actualLignes, expectedLignes] = await filesToString([
      f25File,
      expected,
    ])

    expect(actualLignes).toEqual(expectedLignes)
  })
})
