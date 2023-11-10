// ---
// JSON
// ---

type JSONHeavydynReportVAny = JSONHeavydynReport

interface JSONHeavydynReport {
  readonly version: 1
  readonly base: JSONBaseReport
  readonly distinct: JSONHeavydynReportDistinct
}

interface JSONHeavydynReportDistinct {
  readonly version: 1
  readonly dataLabels: JSONSelectableList<
    JSONHeavydynDataLabelsGroup,
    JSONHeavydynDataLabelsGroups
  >
  readonly thresholds: JSONHeavydynThresholdsConfigurations
}

// ---
// Object
// ---

interface HeavydynReport
  extends HeavydynObject<JSONHeavydynReport>,
    BaseReport<
      HeavydynProject,
      HeavydynZone,
      HeavydynDataLabels,
      HeavydynThresholds
    > {
  readonly addZone: () => Promise<void>
}
