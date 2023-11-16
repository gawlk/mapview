import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import { mpvzExporter } from '/src/scripts/io/exporter'
import { getFilesFromDir } from '/src/scripts/io/tests/utils'

describe('Tests import', async () => {
  const path = `${__dirname}/files`

  const testData = await getFilesFromDir(path)

  beforeAll(() => {
    vi.stubGlobal('navigator', { language: 'fr-FR' })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  test.each(
    testData
      .filter((data) => data.prjz)
      .map((data) => [data.directoryName, data.prjz, data.mpvz.file]),
  )('test PRJZ: %s', async (_, prjz, expected) => {
    const actualMPVZ = await mpvzExporter.export(prjz.project as MachineProject)

    await expect(actualMPVZ).toBeSameZip(expected)
  })
})
