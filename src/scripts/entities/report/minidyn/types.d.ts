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
  readonly groupedDataLabels: SelectableList<
    number,
    JSONMinidynGroupedDataLabels
  >
  readonly thresholdsSelected: MinidynUnitsSkeleton<number>
}

interface JSONMinidynGroupedDataLabels {
  readonly version: 1
  readonly from: DataLabelsFrom
  readonly choices: SelectableList<number, JSONDataLabel<MinidynUnitsNames>>
  readonly indexes?: SelectableList<number, JSONMinidynDropIndex>
}

// ---
// Object
// ---

interface MinidynReport extends BaseReport {
  readonly machine: 'Minidyn'
  readonly zones: MinidynZone[]
  readonly dataLabels: MinidynReportDataLabels
  readonly thresholds: MinidynReportThresholds
  project: MinidynProject
  toJSON: () => JSONMinidynReport
}

interface MinidynReportDataLabels extends BaseReportDataLabels {
  readonly groups: SelectableList<MinidynGroupedDataLabels>
  readonly table: SelectableList<MinidynTableDataLabelsParameters>
}
interface MinidynGroupedDataLabels extends BaseGroupedDataLabels {
  readonly indexes?: SelectableList<MinidynDropIndex>
}

interface MinidynTableDataLabelsParameters
  extends BaseTableDataLabelsParameters {
  readonly group: MinidynGroupedDataLabels
  index?: MinidynDropIndex
}

interface MinidynReportThresholds extends BaseReportThresholds {
  readonly groups: MinidynReportThresholdsGroups
}

type MinidynReportThresholdsGroups = MinidynUnitsSkeleton<
  GroupedThresolds<string>
>
