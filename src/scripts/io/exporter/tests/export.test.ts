import { readdirSync, statSync } from 'fs'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import {
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
  mpvzExporter,
  mvrzExporter,
} from '/src/scripts'

import { importFiles } from './scripts'

import { filesToString } from '/src/tests'

describe('Test exports', async () => {
  const testData: ReportTestExportData[] = []

  const path = `${__dirname}/files`
  const files = readdirSync(path)

  await Promise.all([
    ...files.map(async (file) => {
      const subPath = `${path}/${file}`
      const stats = statSync(subPath)

      if (stats.isDirectory()) {
        testData.push(...(await importFiles(subPath, file)))
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
    const pdxFile = heavydynPDXExporter.export(project as HeavydynProject)
    expect(pdxFile).toBeDefined()
    await expect(pdxFile).toBeSameLineOrder(expected)
    await expect(pdxFile).toBeSameValue(expected)
  })

  test.each(
    testData
      .filter((data) => data.fwdSweco)
      .map((data) => [data.directoryName, data.mpvz.project, data.fwdSweco])
  )('test FWD (Sweco): %s', async (_, project, expected) => {
    const swecoFile = heavydynSwecoExporter.export(project as HeavydynProject)

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
    const dynatestFile = heavydynDynatestExporter.export(
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
      .filter((data) => data.f25)
      .map((data) => [data.directoryName, data.mpvz.project, data.f25])
  )('test F25: %s', async (_, project, expected) => {
    const f25File = heavydynF25Exporter.export(project as HeavydynProject)

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
    const mvrzFile = await mvrzExporter.export(project as MachineProject)

    expect(mvrzFile.name).toSatisfy(
      (val: string) => val.substring(val.length - 4) === 'mvrz'
    )

    await expect(mvrzFile).toBeSameZip(expected)
  })

  test.each(
    testData
      .filter((data) => data.mpvz.file)
      .map((data) => [data.directoryName, data.mpvz.project, data.mpvz.file])
  )('test mpvz: %s', async (_, project, expected) => {
    const mpvzFile = await mpvzExporter.export(project as MachineProject)

    expect(mpvzFile.name).toSatisfy(
      (val: string) => val.substring(val.length - 4) === 'mpvz'
    )

    await expect(mpvzFile).toBeSameZip(expected)
  })
})
