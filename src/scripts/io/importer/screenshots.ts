import { convertUint8ArrayToData64Image } from '/src/scripts'

export const screenshotFolderPathInZip = 'screenshots/'

export const getScreenshotFileNamesFromZIP = (zip: Fflate.Zippable) =>
  Object.keys(zip)
    .filter((key) => key.startsWith(screenshotFolderPathInZip))
    .map((key) => key.substring(screenshotFolderPathInZip.length))
    .filter((key) => key)

export const importScreenshotsFromZIP = (
  zip: Fflate.Unzipped,
  json: JSONMachineProject,
  project: MachineProject
) => {
  const screenshots = getScreenshotFileNamesFromZIP(zip)

  json.base.reports.list.forEach((jsonReport, index) => {
    jsonReport.base.screenshots.forEach(async (screenshotIndex) => {
      const screenshotFileName = screenshots.find(
        (screenshot) => Number(screenshot.split('.')[0]) === screenshotIndex
      )

      if (screenshotFileName) {
        const array = zip[`${screenshotFolderPathInZip}${screenshotFileName}`]

        const data64 = convertUint8ArrayToData64Image(
          array,
          screenshotFileName.split('.').pop() as string
        )

        project.reports.list[index]?.screenshots.push(data64)
      }
    })
  })
}
