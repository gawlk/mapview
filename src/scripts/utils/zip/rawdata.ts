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
      points = entity.line.sortedPoints.filter((point) => point.checkVisibility)
      break

    // No Default
  }

  points.forEach((point) => {
    if (point.rawDataFile) {
      rawdata[point.id] = new Uint8Array(point.rawDataFile)
    }
  })

  zip.rawdata = rawdata
}
