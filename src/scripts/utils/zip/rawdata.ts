export const addRawDataToZip = async (
  zip: Fflate.Zippable,
  project: MachineProject,
  onlyCurrentReport?: boolean
) => {
  const rawdata: { [key: string]: Uint8Array } = {}

  const points =
    onlyCurrentReport && project.reports.selected
      ? project.reports.selected.line.sortedPoints
      : project.reports.list.map((report) => report.line.sortedPoints).flat()

  await Promise.all([
    ...points.map((point) => {
      if (point.rawDataFile) {
        rawdata[point.id] = new Uint8Array(point.rawDataFile)
      }
    }),
  ])

  zip.rawdata = rawdata
}
