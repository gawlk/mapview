// ---
// JSON
// ---

type JSONBaseReportVAny = JSONBaseReport

interface JSONBaseReport {
  readonly version: 1
  readonly name: string
  readonly zones: JSONMachineZone[]
  readonly settings: JSONReportSettings
  readonly screenshots: number[]
  readonly platform: JSONField[]
  readonly information: JSONField[]
  readonly dataLabels: JSONBaseDataLabels
  readonly thresholds: JSONBaseThresholdsSettings
}

interface JSONReportSettings {
  readonly version: 1
  readonly iconName: IconNameVAny
  readonly isVisible: boolean
  readonly colorization: ReportColorization
  readonly groupBy: ReportGroupBy
}

interface JSONBaseThresholdsSettings {
  readonly version: 1
  readonly inputs: JSONThresholdInputs
  readonly colors: JSONThresholdColorsVAny
}

type JSONThresholdColorsVAny = JSONThresholdColors | JSONThresholdColorsV1

interface JSONThresholdColors {
  readonly version: 2
  readonly low: ColorName
  readonly middle: ColorName
  readonly high: ColorName
}

interface JSONThresholdColorsV1 {
  readonly version: 1
  readonly low: ColorNameV1
  readonly middle: ColorNameV1
  readonly high: ColorNameV1
}

interface JSONThresholdInputs {
  readonly version: 1
  readonly isRequiredARange: boolean
  readonly isOptionalARange: boolean
}

type ReportColorization = 'Threshold' | 'Zone'

type ReportGroupBy = 'Number' | 'Zone'

// ---
// Object
// ---

interface BaseReport<
  Project extends BaseProject = BaseProject,
  Zone extends BaseZone = MachineZone,
  DataLabels extends BaseDataLabels = MachineDataLabels,
  Thresholds extends BaseThresholds = BaseThresholds,
> extends BaseObject<JSONBaseReport>,
    Entity<'Report'> {
  readonly name: Field
  readonly line: Line
  readonly sortedPoints: Accessor<BasePoint[]>
  readonly zones: ASS<Zone[]>
  readonly screenshots: ASS<string[]>
  readonly dataLabels: DataLabels
  readonly thresholds: Thresholds
  readonly settings: BaseReportSettings
  readonly platform: Field[]
  readonly information: Field[]
  readonly project: ASS<Project>
  readonly exportablePoints: Accessor<BasePoint[]>
  readonly fitOnMap: VoidFunction
}

interface BaseReportSettings {
  readonly iconName: ASS<IconName>
  readonly isVisible: ASS<boolean>
  readonly colorization: ASS<ReportColorization>
  readonly groupBy: ASS<ReportGroupBy>
}
