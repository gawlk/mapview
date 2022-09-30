// ---
// JSON
// ---

type JSONMaxidynReportVAny = JSONMaxidynReport

interface JSONMaxidynReport {
  version: 1
  base: JSONBaseReport
  distinct: JSONMaxidynReportDistinct
}

interface JSONMaxidynReportDistinct {
  version: 1
  groupedDataLabels: SelectableList<number, JSONMaxidynGroupedDataLabels>
  thresholdGroups: MaxidynUnitsSkeleton<number>
}

interface JSONMaxidynGroupedDataLabels {
  version: 1
  from: DataLabelsFrom
  choices: SelectableList<number, JSONDataLabel<MaxidynUnitsNames>>
  indexes?: SelectableList<number, JSONMaxidynDropIndex>
}

// ---
// Object
// ---

interface MaxidynReport extends BaseReport {
  readonly machine: 'Maxidyn'
  readonly zones: MaxidynZone[]
  readonly dataLabels: MaxidynReportDataLabels
  readonly platform: MaxidynField[]
  readonly information: MaxidynField[]
  project: MaxidynProject
  toJSON: () => JSONMaxidynReport
}

type MaxidynThresholds = MaxidynUnitsSkeleton<AnyThreshold[]>

interface MaxidynReportDataLabels extends BaseReportDataLabels {
  groups: SelectableList<MaxidynGroupedDataLabels>
  table: SelectableList<MaxidynTableDataLabelsParameters>
}
interface MaxidynGroupedDataLabels extends BaseGroupedDataLabels {
  indexes?: SelectableList<MaxidynDropIndex>
}

interface MaxidynTableDataLabelsParameters
  extends BaseTableDataLabelsParameters {
  group: MaxidynGroupedDataLabels
  index?: MaxidynDropIndex
}
