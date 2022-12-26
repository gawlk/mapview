export const addRawDataToZip = async (
  zip: Fflate.Zippable,
  project: MachineProject
) => {
  const rawdata: { [key: string]: Uint8Array } = {}

  await Promise.all([
    ...project.reports.list
      .map((report) => report.line.sortedPoints)
      .flat()
      .map((point) => {
        if (point.rawDataFile) {
          rawdata[point.id] = new Uint8Array(point.rawDataFile)
        }
      }),
  ])

  zip.rawdata = rawdata
}
