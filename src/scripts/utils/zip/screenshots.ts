import { convertData64ImageToUint8Array } from '/src/scripts'

export const addScreenshotsToZip = async (
  zip: Fflate.Zippable,
  entity: MachineProject | MachineReport,
  json?: JSONMachineProject
) => {
  const screenshotsConverted: { [key: string]: Uint8Array } = {}

  let screenshotData = []

  switch (entity.kind) {
    case 'Project':
      screenshotData = entity.reports.list
        .map((report, reportIndex) =>
          report.screenshots.map((screenshot) => {
            return {
              reportIndex,
              screenshot,
            }
          })
        )
        .flat()
      break
    case 'Report':
      screenshotData = entity.screenshots.map((screenshot) => {
        return {
          reportIndex: 0,
          screenshot,
        }
      })
      break
  }

  await Promise.all(
    screenshotData.map(async (obj, index) => {
      screenshotsConverted[`${index}.png`] =
        await convertData64ImageToUint8Array(obj.screenshot)

      json &&
        json?.base.reports.list[obj.reportIndex].base.screenshots.push(index)
    })
  )

  zip.screenshots = screenshotsConverted
}
