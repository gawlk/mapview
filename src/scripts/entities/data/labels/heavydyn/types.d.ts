// ---
// JSON
// ---

type JSONHeavydynDataLabelsGroup = JSONHeavydynDataLabelsGroups[number]

type JSONHeavydynDataLabelsGroups = [
  JSONHeavydynDropDataLabelsGroup,
  JSONHeavydynTestDataLabelsGroup,
  JSONHeavydynZoneDataLabelsGroup
]

interface JSONHeavydynDropDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Drop', HeavydynUnitsNames>
  readonly distinct: JSONHeavydynDropDataLabelsGroupDistinct
}

interface JSONHeavydynDropDataLabelsGroupDistinct {
  readonly version: 1
  readonly indexes: JSONSelectableList<JSONHeavydynDropIndex>
  readonly sequenceName: string
}

interface JSONHeavydynTestDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Point', HeavydynUnitsNames>
  readonly distinct: {
    readonly version: 1
  }
}

interface JSONHeavydynTestDataLabelsGroupDistinct {
  readonly version: 1
}

interface JSONHeavydynZoneDataLabelsGroup {
  readonly version: 1
  readonly base: JSONBaseDataLabelsGroup<'Zone', HeavydynUnitsNames>
  readonly distinct: JSONHeavydynZoneDataLabelsGroupDistinct
}

interface JSONHeavydynZoneDataLabelsGroupDistinct {
  readonly version: 1
}

// ---
// Object
// ---

interface HeavydynDataLabels extends BaseDataLabels {
  readonly groups: SelectableList<
    HeavydynDataLabelsGroup,
    HeavydynDataLabelsGroups
  >
  // readonly table: SelectableList<HeavydynTableDataLabelsParameters>
}

type HeavydynDataLabelsGroup = HeavydynDataLabelsGroups[number]

type HeavydynDataLabelsGroups = [
  HeavydynDropDataLabelsGroup,
  HeavydynTestDataLabelsGroup,
  HeavydynZoneDataLabelsGroup
]

interface HeavydynDropDataLabelsGroup
  extends BaseDropDataLabelsGroup<HeavydynDropIndex> {
  readonly indexes: SelectableList<HeavydynDropIndex>
  readonly sequenceName: string
  toJSON: () => JSONHeavydynDropDataLabelsGroup
}

interface HeavydynTestDataLabelsGroup extends BaseTestDataLabelsGroup {
  toJSON: () => JSONHeavydynTestDataLabelsGroup
}

interface HeavydynZoneDataLabelsGroup extends BaseZoneDataLabelsGroup {
  toJSON: () => JSONHeavydynZoneDataLabelsGroup
}
