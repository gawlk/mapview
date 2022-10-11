// ---
// JSON
// ---

type JSONHeavydynReportVAny = JSONHeavydynReport

interface JSONHeavydynReport {
  version: 1
  base: JSONBaseReport
  distinct: JSONHeavydynReportDistinct
}

interface JSONHeavydynReportDistinct {
  version: 1
  groupedDataLabels: SelectableList<number, JSONHeavydynGroupedDataLabels>
  thresholds: HeavydynUnitsSkeleton<number>
}

interface JSONHeavydynGroupedDataLabels {
  version: 1
  from: DataLabelsFrom
  choices: SelectableList<number, JSONDataLabel<HeavydynUnitsNames>>
  indexes?: SelectableList<number, JSONHeavydynDropIndex>
}

// ---
// Object
// ---

interface HeavydynReport extends BaseReport {
  readonly machine: 'Heavydyn'
  readonly zones: HeavydynZone[]
  readonly dataLabels: HeavydynReportDataLabels
  readonly platform: Field[]
  readonly information: Field[]
  project: HeavydynProject
  toJSON: () => JSONHeavydynReport
}

type HeavydynThresholds = HeavydynUnitsSkeleton<AnyThreshold[]>

interface HeavydynReportDataLabels extends BaseReportDataLabels {
  groups: SelectableList<HeavydynGroupedDataLabels>
  table: SelectableList<HeavydynTableDataLabelsParameters>
}

interface HeavydynGroupedDataLabels extends BaseGroupedDataLabels {
  indexes?: SelectableList<HeavydynDropIndex>
}

interface HeavydynTableDataLabelsParameters
  extends BaseTableDataLabelsParameters {
  group: HeavydynGroupedDataLabels
  index?: HeavydynDropIndex
}
