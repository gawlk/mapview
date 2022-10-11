// ---
// JSON
// ---

type JSONMinidynReportVAny = JSONMinidynReport

interface JSONMinidynReport {
  version: 1
  base: JSONBaseReport
  distinct: JSONMinidynReportDistinct
}

interface JSONMinidynReportDistinct {
  version: 1
  groupedDataLabels: SelectableList<number, JSONMinidynGroupedDataLabels>
  thresholdGroups: MinidynUnitsSkeleton<number>
}

interface JSONMinidynGroupedDataLabels {
  version: 1
  from: DataLabelsFrom
  choices: SelectableList<number, JSONDataLabel<MinidynUnitsNames>>
  indexes?: SelectableList<number, JSONMinidynDropIndex>
}

// ---
// Object
// ---

interface MinidynReport extends BaseReport {
  readonly machine: 'Minidyn'
  readonly zones: MinidynZone[]
  readonly dataLabels: MinidynReportDataLabels
  readonly platform: Field[]
  readonly information: Field[]
  project: MinidynProject
  toJSON: () => JSONMinidynReport
}

type MinidynThresholds = MinidynUnitsSkeleton<AnyThreshold[]>

interface MinidynReportDataLabels extends BaseReportDataLabels {
  groups: SelectableList<MinidynGroupedDataLabels>
  table: SelectableList<MinidynTableDataLabelsParameters>
}
interface MinidynGroupedDataLabels extends BaseGroupedDataLabels {
  indexes?: SelectableList<MinidynDropIndex>
}

interface MinidynTableDataLabelsParameters
  extends BaseTableDataLabelsParameters {
  group: MinidynGroupedDataLabels
  index?: MinidynDropIndex
}
