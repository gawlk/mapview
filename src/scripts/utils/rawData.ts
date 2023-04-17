export const hasRawData = (source: BaseProject | BaseReport) => {
  const origin = source.kind === 'Project' ? source.reports.list : [source]

  return origin
    .flatMap((report) =>
      report.zones.flatMap((zone) => zone.points as BasePoint[])
    )
    .some((point) => point.rawDataFile)
}
