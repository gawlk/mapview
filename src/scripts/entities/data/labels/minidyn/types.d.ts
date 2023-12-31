// ---
// JSON
// ---

type JSONMinidynDataLabelsGroup = JSONMinidynDataLabelsGroups[number]

type JSONMinidynDataLabelsGroups = [
  JSONMinidynDropDataLabelsGroup,
  JSONMinidynTestDataLabelsGroup,
  JSONMinidynZoneDataLabelsGroup,
]

type JSONMinidynDropDataLabelsGroupVAny = JSONMinidynDropDataLabelsGroup

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
  readonly base: JSONBaseDataLabelsGroup<'Point', MinidynUnitsNames>
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
  MinidynZoneDataLabelsGroup,
]

interface MinidynDropDataLabelsGroup
  extends BaseDropDataLabelsGroup<string, MinidynDropIndex>,
    SerializableObject<JSONMinidynDropDataLabelsGroup> {
  readonly indexes: SelectableList<MinidynDropIndex>
}

interface MinidynTestDataLabelsGroup
  extends BaseTestDataLabelsGroup<string>,
    SerializableObject<JSONMinidynTestDataLabelsGroup> {}

interface MinidynZoneDataLabelsGroup
  extends BaseZoneDataLabelsGroup<string>,
    SerializableObject<JSONMinidynZoneDataLabelsGroup> {}

// interface MinidynTableDataLabelsParameters
//   extends BaseTableDataLabelsParameters {
//   readonly group: MinidynDataLabelsGroup
//   index?: MinidynDropIndex
// }
