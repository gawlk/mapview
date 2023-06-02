export const getPointToExportFromZone = (zone: BaseZone) => {
  return zone.points.filter((point) => point.settings.isVisible)
}

export const getPointToExportFromReport = (report: MachineReport) => {
  return report.line.sortedPoints.filter((point) => point.settings.isVisible)
}
