import { type Unzipped } from 'fflate'

import { convertUint8ArrayToData64Image } from '/src/scripts'

export const importScreenshots = (
  zip: Unzipped,
  json: JSONMachineProject,
  project: MachineProject
) => {
  const screenshots = Object.keys(zip)
    .filter((key) => key.startsWith('screenshots/'))
    .map((key) => key.substring(12))
    .filter((key) => key)

  json.base.reports.list.forEach((jsonReport, index) => {
    jsonReport.base.screenshots.forEach(async (screenshotIndex) => {
      const screenshotFileName = screenshots.find(
        (screenshot) => Number(screenshot.split('.')[0]) === screenshotIndex
      )

      if (screenshotFileName) {
        const array = zip[`screenshots/${screenshotFileName}`]

        const data64 = convertUint8ArrayToData64Image(
          array,
          screenshotFileName.split('.').pop() as string
        )

        project.reports.list[index]?.screenshots.push(data64)
      }
    })
  })
}
