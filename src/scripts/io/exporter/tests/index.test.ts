import { unzipSync } from 'fflate'
import { readFileSync } from 'fs'
import { describe, expect, test } from 'vitest'

import { getScreenshotFileNamesFromZIP, importFile, sleep } from '/src/scripts'

const getFileFromPath = async (path: string) => {
  const url = `${__dirname}${path}`

  const buffer = readFileSync(url)

  return new File([buffer], path.split('/').pop() as string)
}

export const testIfFileIsReturnedFromPath = async (path: string) => {
  const file = await getFileFromPath(path)

  test('File is returned from path', () => {
    expect(file).toBeDefined()
    expect(file).toBeTypeOf('object')
    expect(file.size).toBeGreaterThan(0)
  })

  return file
}

describe('Test importFile()', async () => {
  const path = '/files/heavydyn/demo.prjz'

  const heavydynPRJZ = await testIfFileIsReturnedFromPath(path)

  const project = await importFile(heavydynPRJZ)

  await sleep(2500)

  // eslint-disable-next-line no-console
  console.log(project)

  test('importFile() returns a project', () => {
    expect(project).toBeTypeOf('object')
    expect(project).toHaveProperty('machine')
  })

  const zip = unzipSync(new Uint8Array(await heavydynPRJZ.arrayBuffer()))

  const screenshotsFileNames = getScreenshotFileNamesFromZIP(zip)

  test('Same amount of screenshots', () => {
    expect(screenshotsFileNames.length).toEqual(
      (project?.reports.list as BaseReport[]).reduce(
        (total, report) => total + report.screenshots.length,
        0
      )
    )
  })
})
