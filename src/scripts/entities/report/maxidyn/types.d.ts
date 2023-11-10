// ---
// JSON
// ---

type JSONMaxidynReportVAny = JSONMaxidynReport

interface JSONMaxidynReport {
  readonly version: 1
  readonly base: JSONBaseReport
  readonly distinct: JSONMaxidynReportDistinct
}

interface JSONMaxidynReportDistinct {
  readonly version: 1
  readonly dataLabels: JSONSelectableList<
    JSONMaxidynDataLabelsGroup,
    JSONMaxidynDataLabelsGroups
  >
  readonly thresholds: JSONMaxidynThresholdsConfigurations
}

// ---
// Object
// ---

interface MaxidynReport
  extends MaxidynObject<JSONMaxidynReport>,
    BaseReport<
      MaxidynProject,
      MaxidynZone,
      MaxidynDataLabels,
      MaxidynThresholds
    > {
  readonly addZone: () => Promise<void>
}
