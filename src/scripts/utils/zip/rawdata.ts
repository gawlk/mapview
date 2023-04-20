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
  }

  await Promise.all([
    ...points.map((point) => {
      console.log('point data', point.id, point.rawDataFile)
      if (point.rawDataFile) {
        rawdata[point.id] = new Uint8Array(point.rawDataFile)
      }
    }),
  ])

  zip.rawdata = rawdata
}
