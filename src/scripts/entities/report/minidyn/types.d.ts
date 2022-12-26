// ---
// JSON
// ---

type JSONMinidynReportVAny = JSONMinidynReport

interface JSONMinidynReport {
  readonly version: 1
  readonly base: JSONBaseReport
  readonly distinct: JSONMinidynReportDistinct
}

interface JSONMinidynReportDistinct {
  readonly version: 1
  readonly dataLabels: JSONSelectableList<
    JSONMinidynDataLabelsGroup,
    JSONMinidynDataLabelsGroups
  >
  readonly thresholds: JSONMinidynThresholdsConfigurations
}

type JSONMinidynThresholdsConfigurations =
  MinidynUnitsSkeleton<JSONDistinctThresholdsConfiguration>

// ---
// Object
// ---

interface MinidynReport
  extends MinidynObject<JSONMinidynReport>,
    BaseReport<
      MinidynProject,
      MinidynZone,
      MinidynDataLabels,
      MinidynThresholds
    > {
  addZone: () => void
}
