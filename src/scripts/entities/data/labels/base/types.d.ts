// ---
// JSON
// ---

interface JSONBaseDataLabelsGroup<
  From extends DataLabelsFrom,
  T extends string,
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
    category?: DataCategory,
  ) => DataLabel<string, string> | undefined
  readonly pushTo: (from: DataLabelsFrom, label: DataLabel) => void
}

type BaseDataLabelsGroups = [
  BaseDropDataLabelsGroup<string, BaseDropIndex>,
  BaseTestDataLabelsGroup<string>,
  BaseZoneDataLabelsGroup<string>,
]

type AnyBaseDataLabelsGroup = BaseDataLabelsGroups[number]

interface BaseDataLabelsGroup<
  From extends DataLabelsFrom,
  T extends string = string,
> extends BaseObject<JSONBaseDataLabelsGroup<From, string>> {
  readonly from: From
  readonly choices: SelectableList<DataLabel<T>>
  readonly saveableChoices: DataLabel<T>[]
}

interface BaseDropDataLabelsGroup<T extends string, Drop extends BaseDropIndex>
  extends BaseDataLabelsGroup<'Drop', T> {
  readonly indexes: SelectableList<Drop>
}

interface BaseTestDataLabelsGroup<T extends string>
  extends BaseDataLabelsGroup<'Point', T> {}

interface BaseZoneDataLabelsGroup<T extends string>
  extends BaseDataLabelsGroup<'Zone', T> {}

interface BaseTableDataLabelsParameters {
  readonly group: AnyBaseDataLabelsGroup
  readonly dataLabels: ASS<DataLabel<string>[]>
  readonly index?: ASS<BaseDropIndex>
}

type CategorySelector = (unitKey: MachineUnitsNames) => DataCategory
