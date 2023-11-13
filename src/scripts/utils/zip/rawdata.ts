export const addRawDataToZip = (
  zip: Zippable,
  entity: MachineProject | MachineReport,
) => {
  const rawdata: { [key: string]: Uint8Array } = {}

  let points = []

  switch (entity.kind) {
    case 'Project': {
      points = entity.reports.list().flatMap((report) => report.sortedPoints())
      break
    }
    case 'Report': {
      points = entity.sortedPoints().filter((point) => point.shouldBeOnMap())
      break
    }
  }

  points.forEach((point) => {
    const file = point.rawDataFile()
    if (file) {
      rawdata[point.id] = new Uint8Array(file)
    }
  })

  zip.rawdata = rawdata
}
