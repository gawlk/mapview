/* eslint-disable no-await-in-loop */
import { readdirSync, statSync } from 'fs'

import {
  getAllPointsFromProject,
  importFile,
  removeLeading0s,
  sleep,
  unzipFile,
} from '/src/scripts'
import { getFileFromPath } from '/src/tests'

export const getFilesFromDir = async (path: string) => {
  const files = readdirSync(path)

  const testData: ReportTestExportData[] = []

  await Promise.all([
    ...files.map(async (file) => {
      const subPath = `${path}/${file}`
      const stats = statSync(subPath)

      if (stats.isDirectory()) {
        testData.push(...(await loadFiles(subPath, file)))
      }
    }),
  ])

  return testData
}

const acceptedExtension = ['pdx', 'F25', 'fwd', 'mpvz', 'mvrz', 'prjz', 'dynz']

// eslint-disable-next-line sonarjs/cognitive-complexity
export const loadFiles = async (dirPath: string, folderName?: string) => {
  const files = readdirSync(dirPath)
  const filesGroup: Partial<ReportTestExportData> = {
    directoryName: folderName,
  }
  const filesGroups: ReportTestExportData[] = []

  let onlyFolder = true

  const promises: Promise<unknown>[] = []

  // eslint-disable-next-line no-restricted-syntax
  for (const fileName of files) {
    const part = fileName.split('.')
    const extension = part[part.length - 1]

    const subPath = `${dirPath}/${fileName}`
    const stats = statSync(subPath)

    if (stats.isFile() && acceptedExtension.includes(extension)) {
      onlyFolder = false
      const file = getFileFromPath(subPath)

      switch (extension) {
        case 'prjz':
        case 'dynz':
        case 'mpvz': {
          const project = await importFile(file)

          if (project) {
            promises.push(loadMpvz(file, project))

            filesGroup[extension === 'mpvz' ? 'mpvz' : 'prjz'] = {
              file,
              project,
            }
          }
          break
        }
        case 'fwd':
          fileName.toLowerCase().includes('sweco')
            ? (filesGroup.fwdSweco = file)
            : (filesGroup.fwdDynatest = file)
          break
        case 'F25':
          filesGroup.f25 = file
          break
        case 'pdx':
          filesGroup.pdx = file
          break
        case 'mvrz':
          filesGroup.mvrz = file
          break
      }
    } else if (stats.isDirectory()) {
      filesGroups.push(
        ...(await loadFiles(
          subPath,
          `${folderName || ''}${folderName ? '/' : ''}${fileName}`,
        )),
      )
    }
  }

  await Promise.all(promises)

  return onlyFolder
    ? filesGroups
    : [filesGroup as ReportTestExportData, ...filesGroups]
}

export const loadMpvz = async (mpvzFile: File, project: MachineProject) => {
  project.addToMap()
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve) => {
    const unzipped = await unzipFile(mpvzFile)

    const raws = Object.keys(unzipped).filter((key) =>
      key.match(/rawdata\/\w+/),
    )

    if (raws.length < 1) {
      resolve()
    }

    let needInit = true

    // rawdata and screenshoot are load in async so we wetting for the data to be init
    while (needInit) {
      const points = getAllPointsFromProject(project)

      const status: boolean[] = []

      raws.forEach((key) => {
        const id = key.split('/')[1]
        const point = points.find(
          (p) => removeLeading0s(p.id) === removeLeading0s(id),
        )

        status.push(point?.rawDataFile?.byteLength === undefined)
      })

      needInit = status.length > 0 && status.every((value) => value)

      await sleep(250)
    }

    resolve()
  })
}
