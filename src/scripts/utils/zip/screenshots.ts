import { convertData64ImageToUint8Array } from '/src/scripts'

export const addScreenshotsToZip = async (
  zip: Fflate.Zippable,
  project: MachineProject,
  json?: JSONMachineProject
) => {
  const screenshots: { [key: string]: Uint8Array } = {}

  await Promise.all(
    project.reports.list
      .map((report, reportIndex) =>
        report.screenshots.map((screenshot) => {
          return {
            reportIndex,
            screenshot,
          }
        })
      )
      .flat()
      .map(async (obj, index) => {
        screenshots[`${index}.png`] = await convertData64ImageToUint8Array(
          obj.screenshot
        )

        json?.base.reports.list[obj.reportIndex].base.screenshots.push(index)
      })
  )

  zip.screenshots = screenshots
}
