import { unzipSync } from 'fflate'
import { readFileSync } from 'fs'
import { assert, describe, expect, test, vi } from 'vitest'

import {
  getProjectJSONFromZip,
  getScreenshotFileNamesFromZIP,
  importFile,
  sleep,
  unzipFile,
} from '/src/scripts'

const getFileFromPath = async (path: string) => {
  const url = `${__dirname}${path}`

  const buffer = readFileSync(url)

  return new File([buffer], path.split('/').pop() as string)
}

// describe('suite name', async () => {
//   const project = await getProject()

//   if (project) {
//     const context = new Context(new F25ExportStrategy())
//     context.doExport(project)
//     const goodFileContent = fs.readFileSync(__dirname + '/mr.F25').toString()

//     const linesGoodFile = goodFileContent.replaceAll('\r', '').split('\n')
//     context.fileContent.split('\n').forEach((line, i) => {
//       if (i === 41) return
//       it('test line ' + i, () => {
//         expect(line).toEqual(linesGoodFile[i])
//       })
//     })
//   }
// })

// describe('test pdx', async () => {
//   const project = await getProject()

//   if (project) {
//     const context = new Context(new PDXExportStrategy())
//     context.doExport(project)

//     console.log(context.fileContent)
//   }
//   it('test', () => {
//     expect(1 + 1).toEqual(2)
//   })
// })

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

  const unzipped = await unzipFile(heavydynPRJZ)

  const json = getProjectJSONFromZip(unzipped, path.split('.').pop() || '')

  const project = await importFile(heavydynPRJZ)

  await sleep(2500)

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

  // test('Screenshots are correctly imported', () => {
  //   project?.reports.list.forEach((report, index) => {
  //     report.screenshots.forEach((screenshot) => {
  //       const screenshotFileName = screenshots.find(
  //         (screenshot) => Number(screenshot.split('.')[0]) === screenshotIndex
  //       )

  //       if (screenshotFileName) {
  //         const array = zip[`${screenshotFolderPathInZip}${screenshotFileName}`]

  //         const data64 = convertUint8ArrayToData64Image(
  //           array,
  //           screenshotFileName.split('.').pop() as string
  //         )

  //         project.reports.list[index]?.screenshots.push(data64)
  //       }
  //     })
  //   })

  //   console.log('paths', screenshotsFileNames)
  // })

  // console.log(project)
})