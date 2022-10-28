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
  readonly groupedDataLabels: SelectableList<
    number,
    JSONHeavydynGroupedDataLabels
  >
  readonly thresholds: HeavydynUnitsSkeleton<JSONDistinctThresholdsConfiguration>
}

interface JSONHeavydynGroupedDataLabels {
  readonly version: 1
  readonly from: DataLabelsFrom
  readonly choices: SelectableList<number, JSONDataLabel<HeavydynUnitsNames>>
  readonly indexes?: SelectableList<number, JSONHeavydynDropIndex>
}

// ---
// Object
// ---

interface HeavydynReport extends BaseReport {
  readonly machine: 'Heavydyn'
  readonly zones: HeavydynZone[]
  readonly dataLabels: HeavydynReportDataLabels
  readonly thresholds: HeavydynReportThresholds
  project: HeavydynProject
  toJSON: () => JSONHeavydynReport
}

interface HeavydynReportDataLabels extends BaseReportDataLabels {
  readonly groups: SelectableList<HeavydynGroupedDataLabels>
  readonly table: SelectableList<HeavydynTableDataLabelsParameters>
}

interface HeavydynGroupedDataLabels extends BaseGroupedDataLabels {
  readonly indexes?: SelectableList<HeavydynDropIndex>
}

interface HeavydynTableDataLabelsParameters
  extends BaseTableDataLabelsParameters {
  readonly group: HeavydynGroupedDataLabels
  index?: HeavydynDropIndex
}

interface HeavydynReportThresholds extends BaseReportThresholds {
  readonly groups: HeavydynUnitsSkeleton<GroupedThresolds<string>>
}

type HeavydynReportThresholdsGroups = HeavydynUnitsSkeleton<
  GroupedThresolds<string>
>
