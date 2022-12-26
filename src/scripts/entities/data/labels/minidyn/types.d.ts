// ---
// JSON
// ---

type JSONMinidynDataLabelsGroup = JSONMinidynDataLabelsGroups[number]

type JSONMinidynDataLabelsGroups = [
  JSONMinidynDropDataLabelsGroup,
  JSONMinidynTestDataLabelsGroup,
  JSONMinidynZoneDataLabelsGroup
]

type AnyJSONMinidynDropDataLabelsGroup = JSONMinidynDropDataLabelsGroup

interface JSONMinidynDropDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Drop', MinidynUnitsNames>
  readonly distinct: JSONMinidynDropDataLabelsGroupDistinct
}

interface JSONMinidynDropDataLabelsGroupDistinct {
  readonly version: 1
  readonly indexes: JSONSelectableList<JSONMinidynDropIndex>
}

interface JSONMinidynTestDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Test', MinidynUnitsNames>
  readonly distinct: JSONMinidynTestDataLabelsGroupDistinct
}

interface JSONMinidynTestDataLabelsGroupDistinct {
  readonly version: 1
}

interface JSONMinidynZoneDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Zone', MinidynUnitsNames>
  readonly distinct: JSONMinidynZoneDataLabelsGroupDistinct
}

interface JSONMinidynZoneDataLabelsGroupDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface MinidynDataLabels extends BaseDataLabels {
  readonly groups: SelectableList<
    MinidynDataLabelsGroup,
    MinidynDataLabelsGroups
  >
  // readonly table: SelectableList<MinidynTableDataLabelsParameters>
}

type MinidynDataLabelsGroup = MinidynDataLabelsGroups[number]

type MinidynDataLabelsGroups = [
  MinidynDropDataLabelsGroup,
  MinidynTestDataLabelsGroup,
  MinidynZoneDataLabelsGroup
]

interface MinidynDropDataLabelsGroup
  extends BaseDropDataLabelsGroup<MinidynDropIndex> {
  readonly indexes: SelectableList<MinidynDropIndex>
  toJSON: () => JSONMinidynDropDataLabelsGroup
}

interface MinidynTestDataLabelsGroup extends BaseTestDataLabelsGroup {
  toJSON: () => JSONMinidynTestDataLabelsGroup
}

interface MinidynZoneDataLabelsGroup extends BaseZoneDataLabelsGroup {
  toJSON: () => JSONMinidynZoneDataLabelsGroup
}

// interface MinidynTableDataLabelsParameters
//   extends BaseTableDataLabelsParameters {
//   readonly group: MinidynDataLabelsGroup
//   index?: MinidynDropIndex
// }
