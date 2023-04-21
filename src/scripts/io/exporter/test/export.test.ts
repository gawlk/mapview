import { file } from '@babel/types'
import { unzipSync } from 'fflate'
import { readdirSync, statSync } from 'fs'
import {
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
  mvrzExporter,
} from 'src/scripts/io/exporter/report'
import { filesToString, getFileFromPath } from 'test/utils'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import {
  getAllPointsFromProject,
  importFile,
  removeLeading0s,
  sleep,
  unzipFile,
} from '/src/scripts'

interface MPVZTestData {
  file: File
  project: Awaited<ReturnType<typeof importFile>>
}

interface filesGroup {
  directoryName: string
  pdx: File
  mvrz: File
  fwdDynatest: File
  fwdSweco: File
  F25: File
  mpvz: MPVZTestData
  [key: string]: MPVZTestData | File | string
}

const ignoredFiles = ['.DS_Store']

const exportFile = async (dirPath: string, folderName?: string) => {
  const files = readdirSync(dirPath)
  const filesGroup: Partial<filesGroup> = { directoryName: folderName }
  const filesGroups: filesGroup[] = []

  let onlyFolder = true

  const promises: Promise<unknown>[] = []

  for (const fileName of files) {
    const part = fileName.split('.')
    const extension = part[part.length - 1]

    const subPath = `${dirPath}/${fileName}`
    const stats = statSync(subPath)

    if (stats.isFile() && !ignoredFiles.includes(fileName)) {
      onlyFolder = false
      const file = await getFileFromPath(subPath)

      switch (extension) {
        case 'mpvz': {
          const project = await importFile(file)
          project?.addToMap()

          promises.push(
            new Promise(async (resolve) => {
              const unzipped = await unzipFile(file)

              const raws = Object.keys(unzipped).filter((key) =>
                key.match(/rawdata\/\w+/)
              )

              if (raws.length < 1) {
                resolve(true)
              }

              let needInit = true

              // rawdata and screenshoot are load in async so we wetting for the data to be init
              while (needInit) {
                const points = getAllPointsFromProject(
                  project as MachineProject
                )

                raws.forEach((key) => {
                  const id = key.split('/')[1]
                  const point = points.find(
                    (p) => removeLeading0s(p.id) === removeLeading0s(id)
                  )

                  needInit =
                    needInit && point?.rawDataFile?.byteLength !== undefined
                })

                await sleep(250)
              }

              resolve(true)
            })
          )

          filesGroup.mpvz = {
            file: file,
            project,
          }
          break
        }
        case 'fwd':
          fileName.toLowerCase().includes('sweco')
            ? (filesGroup.fwdSweco = file)
            : (filesGroup.fwdDynatest = file)
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

  await Promise.all(promises)

  return onlyFolder ? filesGroups : [filesGroup as filesGroup, ...filesGroups]
}

describe('Test exports', async () => {
  const testData: filesGroup[] = []

  const path = `${__dirname}/files`
  const files = readdirSync(path)

  await Promise.all([
    ...files.map(async (file) => {
      const subPath = `${path}/${file}`
      const stats = statSync(subPath)

      if (stats.isDirectory()) {
        testData.push(...(await exportFile(subPath, file)))
      }
    }),
  ])

  beforeAll(() => {
    vi.stubGlobal('navigator', { language: 'fr-FR' })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  test.each(
    testData
      .filter((data) => data.pdx)
      .map((data) => [data.directoryName, data.mpvz.project, data.pdx])
  )('test PDX: %s', async (_, project, expected) => {
    const pdxFile = await heavydynPDXExporter.export(project as HeavydynProject)
    expect(pdxFile).toBeDefined()
    await expect(pdxFile).toBeSameLineOrder(expected)
    await expect(pdxFile).toBeSameValue(expected)
  })

  test.each(
    testData
      .filter((data) => data.fwdSweco)
      .map((data) => [data.directoryName, data.mpvz.project, data.fwdSweco])
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
    testData
      .filter((data) => data.fwdDynatest)
      .map((data) => [data.directoryName, data.mpvz.project, data.fwdDynatest])
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

  test.each(
    testData
      .filter((data) => data.F25)
      .map((data) => [data.directoryName, data.mpvz.project, data.F25])
  )('test F25: %s', async (_, project, expected) => {
    const f25File = await heavydynF25Exporter.export(project as HeavydynProject)

    expect(f25File).toBeDefined()

    const [actualLignes, expectedLignes] = await filesToString([
      f25File,
      expected,
    ])

    expect(actualLignes).toEqual(expectedLignes)
  })

  test.each(
    testData
      .filter((data) => data.mvrz)
      .map((data) => [data.directoryName, data.mpvz.project, data.mvrz])
  )('test mvrz: %s', async (_, project, expected) => {
    const mpvzFile = await mvrzExporter.export(project as MachineProject)

    expect(mpvzFile.name).toSatisfy(
      (val: string) => val.substring(val.length - 4) === 'mvrz'
    )

    const data = new Uint8Array(await mpvzFile.arrayBuffer())

    expect(() => unzipSync(data)).not.toThrowError('invalid zip data')

    const expectedData = new Uint8Array(await expected.arrayBuffer())

    const unzippedContent = unzipSync(data)
    const unzippedExpected = unzipSync(expectedData)

    expect(unzippedContent).toHaveSameRawData(unzippedExpected)
    expect(unzippedContent).toHaveSameScreenshots(unzippedExpected)
    expect(unzippedContent).toHaveSameJson(unzippedExpected)
  })
})
