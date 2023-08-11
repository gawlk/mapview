// ---
// JSON
// ---

type JSONMaxidynDataLabelsGroup = JSONMaxidynDataLabelsGroups[number]

type JSONMaxidynDataLabelsGroups = [
  JSONMaxidynDropDataLabelsGroup,
  JSONMaxidynTestDataLabelsGroup,
  JSONMaxidynZoneDataLabelsGroup,
]

interface JSONMaxidynDropDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Drop', MaxidynUnitsNames>
  readonly distinct: JSONMaxidynDropDataLabelsGroupDistinct
}

interface JSONMaxidynDropDataLabelsGroupDistinct {
  readonly version: 1
  readonly indexes: JSONSelectableList<JSONMaxidynDropIndex>
}

interface JSONMaxidynTestDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Point', MaxidynUnitsNames>
  readonly distinct: {
    readonly version: 1
  }
}

interface JSONMaxidynTestDataLabelsGroupDistinct {
  readonly version: 1
}

interface JSONMaxidynZoneDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Zone', MaxidynUnitsNames>
  readonly distinct: JSONMaxidynZoneDataLabelsGroupDistinct
}

interface JSONMaxidynZoneDataLabelsGroupDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface MaxidynDataLabels extends BaseDataLabels {
  readonly groups: SelectableList<
    MaxidynDataLabelsGroup,
    MaxidynDataLabelsGroups
  >
  // readonly table: SelectableList<MaxidynTableDataLabelsParameters>
}

type MaxidynDataLabelsGroup = MaxidynDataLabelsGroups[number]

type MaxidynDataLabelsGroups = [
  MaxidynDropDataLabelsGroup,
  MaxidynTestDataLabelsGroup,
  MaxidynZoneDataLabelsGroup,
]

interface MaxidynDropDataLabelsGroup
  extends BaseDropDataLabelsGroup<MaxidynDropIndex> {
  readonly indexes: SelectableList<MaxidynDropIndex>
  toJSON: () => JSONMaxidynDropDataLabelsGroup
}

interface MaxidynTestDataLabelsGroup extends BaseTestDataLabelsGroup {
  toJSON: () => JSONMaxidynTestDataLabelsGroup
}

interface MaxidynZoneDataLabelsGroup extends BaseZoneDataLabelsGroup {
  toJSON: () => JSONMaxidynZoneDataLabelsGroup
}

// interface MaxidynTableDataLabelsParameters
//   extends BaseTableDataLabelsParameters {
//   readonly group: MaxidynDataLabelsGroup
//   index?: MaxidynDropIndex
// }
