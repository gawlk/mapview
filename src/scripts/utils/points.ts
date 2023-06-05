export const filterExportablePointsFromZone = (zone: BaseZone) => {
  return zone.points.filter((point) => point.settings.isVisible)
}

export const filterExportablePointsFromReport = (report: MachineReport) => {
  return report.line.sortedPoints.filter((point) => point.settings.isVisible)
}
