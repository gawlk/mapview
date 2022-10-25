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
  readonly groupedDataLabels: SelectableList<
    number,
    JSONMaxidynGroupedDataLabels
  >
  readonly thresholdsSelected: MaxidynUnitsSkeleton<number>
}

interface JSONMaxidynGroupedDataLabels {
  readonly version: 1
  readonly from: DataLabelsFrom
  readonly choices: SelectableList<number, JSONDataLabel<MaxidynUnitsNames>>
  readonly indexes?: SelectableList<number, JSONMaxidynDropIndex>
}

// ---
// Object
// ---

interface MaxidynReport extends BaseReport {
  readonly machine: 'Maxidyn'
  readonly zones: MaxidynZone[]
  readonly dataLabels: MaxidynReportDataLabels
  readonly thresholds: MaxidynReportThresholds
  project: MaxidynProject
  toJSON: () => JSONMaxidynReport
}

interface MaxidynReportDataLabels extends BaseReportDataLabels {
  readonly groups: SelectableList<MaxidynGroupedDataLabels>
  readonly table: SelectableList<MaxidynTableDataLabelsParameters>
}

interface MaxidynGroupedDataLabels extends BaseGroupedDataLabels {
  readonly indexes?: SelectableList<MaxidynDropIndex>
}

interface MaxidynTableDataLabelsParameters
  extends BaseTableDataLabelsParameters {
  readonly group: MaxidynGroupedDataLabels
  index?: MaxidynDropIndex
}

interface MaxidynReportThresholds extends BaseReportThresholds {
  readonly groups: MaxidynUnitsSkeleton<GroupedThresolds<string>>
}

type MaxidynReportThresholdsGroups = MaxidynUnitsSkeleton<
  GroupedThresolds<string>
>
