/* eslint-disable no-await-in-loop */
import { readdirSync, statSync } from 'fs'

import {
  sleep as _sleep,
  getAllPointsFromProject,
  importFile,
  removeLeading0s,
  sleep,
  unzipFile,
} from '/src/scripts'
import { getFileFromPath } from '/src/tests'

const acceptedExtension = ['pdx', 'F25', 'fwd', 'mpvz', 'mvrz']

// eslint-disable-next-line sonarjs/cognitive-complexity
export const importFiles = async (dirPath: string, folderName?: string) => {
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
        case 'mpvz': {
          const project = await importFile(file)

          await sleep(10000)

          project?.addToMap()

          promises.push(
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve) => {
              const unzipped = await unzipFile(file)

              const raws = Object.keys(unzipped).filter((key) =>
                key.match(/rawdata\/\w+/),
              )

              if (raws.length < 1) {
                resolve(true)
              }

              let needInit = true

              // rawdata and screenshoot are load in async so we wetting for the data to be init
              while (needInit) {
                const points = getAllPointsFromProject(
                  project as MachineProject,
                )

                raws.forEach((key) => {
                  const id = key.split('/')[1]
                  const point = points.find(
                    (p) => removeLeading0s(p.id) === removeLeading0s(id),
                  )

                  needInit =
                    needInit && point?.rawDataFile?.byteLength !== undefined
                })

                await _sleep(250)
              }

              resolve(true)
            }),
          )

          filesGroup.mpvz = {
            file,
            project,
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
        ...(await importFiles(
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
