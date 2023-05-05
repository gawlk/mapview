// ---
// JSON
// ---

interface JSONBaseDataLabelsGroup<
  From extends DataLabelsFrom,
  T extends string
> {
  readonly version: 1
  readonly from: From
  readonly choices: JSONSelectableList<JSONDataLabel<T>>
}

interface JSONBaseDataLabels {
  readonly version: 1
  readonly table: JSONSelectableList<JSONTableDataLabelsParameters>
}

interface JSONTableDataLabelsParameters {
  readonly version: 1
  readonly from: DataLabelsFrom
  readonly index?: number
  readonly dataLabels: JSONTableDataLabelsValues[]
}

interface JSONTableDataLabelsValues {
  readonly version: 1
  readonly name: string
  readonly category: string
}

type DataLabelsFrom = 'Drop' | 'Point' | 'Zone'

// ---
// Object
// ---

interface BaseDataLabels extends BaseObject<JSONBaseDataLabels> {
  readonly groups: SelectableList<AnyBaseDataLabelsGroup, BaseDataLabelsGroups>
  readonly table: SelectableList<BaseTableDataLabelsParameters>
  readonly getList: (from: DataLabelsFrom) => DataLabel<string, string>[]
  readonly findIn: (
    from: DataLabelsFrom,
    name: string,
    category?: DataCategory
  ) => DataLabel<string, string> | undefined
  readonly pushTo: (
    from: DataLabelsFrom,
    label: DataLabel
  ) => DataLabel<string, string> | undefined
}

type BaseDataLabelsGroups = [
  BaseDropDataLabelsGroup<BaseDropIndex>,
  BaseTestDataLabelsGroup,
  BaseZoneDataLabelsGroup
]

type AnyBaseDataLabelsGroup = BaseDataLabelsGroups[number]

interface BaseDataLabelsGroup<From extends DataLabelsFrom>
  extends BaseObject<JSONBaseDataLabelsGroup<From, string>> {
  readonly from: From
  readonly choices: SelectableList<DataLabel<string>>
}

interface BaseDropDataLabelsGroup<Drop extends BaseDropIndex>
  extends BaseDataLabelsGroup<'Drop'> {
  readonly indexes: SelectableList<Drop>
}

interface BaseTestDataLabelsGroup extends BaseDataLabelsGroup<'Point'> {}

interface BaseZoneDataLabelsGroup extends BaseDataLabelsGroup<'Zone'> {}

interface BaseTableDataLabelsParameters {
  readonly group: AnyBaseDataLabelsGroup
  dataLabels: DataLabel<string>[]
  index?: BaseDropIndex
}

type CategorySelector = (unitKey: MachineUnitsNames) => DataCategory
