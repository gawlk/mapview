export const addRawDataToZip = async (
  zip: Fflate.Zippable,
  entity: MachineProject | MachineReport
) => {
  const rawdata: { [key: string]: Uint8Array } = {}

  let points = []

  switch (entity.kind) {
    case 'Project':
      points = entity.reports.list
        .map((report) => report.line.sortedPoints)
        .flat()
      break
    case 'Report':
      points = entity.line.sortedPoints
      break
  }

  await Promise.all([
    ...points
      .filter((point) => point.checkVisibility)
      .map((point) => {
        if (point.rawDataFile) {
          rawdata[point.id] = new Uint8Array(point.rawDataFile)
        }
      }),
  ])

  zip.rawdata = rawdata
}
