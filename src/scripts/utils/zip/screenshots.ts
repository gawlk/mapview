import { convertData64ImageToUint8Array } from '/src/scripts'

export const addScreenshotsToZip = async (
  zip: Zippable,
  entity: MachineProject | MachineReport,
  json?: JSONMachineProject,
) => {
  const screenshotsConverted: { [key: string]: Uint8Array } = {}

  let screenshotsData = []

  switch (entity.kind) {
    case 'Project':
      screenshotsData = entity.reports
        .list()
        .map((report, reportIndex) =>
          report.screenshots().map((screenshot) => {
            return {
              reportIndex,
              screenshot,
            }
          }),
        )
        .flat()
      break
    case 'Report':
      screenshotsData = entity.screenshots().map((screenshot) => {
        return {
          reportIndex: 0,
          screenshot,
        }
      })
      break
  }

  await Promise.all(
    screenshotsData.map(async (obj, index) => {
      screenshotsConverted[`${index}.png`] =
        await convertData64ImageToUint8Array(obj.screenshot)

      json?.base.reports.list[obj.reportIndex].base.screenshots.push(index)
    }),
  )

  zip.screenshots = screenshotsConverted
}
