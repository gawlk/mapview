import {
  createMinidynDropIndexFromJSON,
  createSelectableList,
} from '/src/scripts'

import {
  createBaseDataLabelsFromJSON,
  createBaseDropDataLabelsGroupFromJSON,
  createBaseTestDataLabelsGroupFromJSON,
  createBaseZoneDataLabelsGroupFromJSON,
} from '../base'

export const createMinidynDataLabelsFromJSON = (
  jsonGroups: JSONSelectableList<
    JSONMinidynDataLabelsGroup,
    JSONMinidynDataLabelsGroups
  >,
  jsonTable: JSONSelectableList<JSONTableDataLabelsParameters>,
  project: MinidynProject
): MinidynDataLabels => {
  const list: MinidynDataLabelsGroups = [
    createMinidynDropDataLabelsGroupFromJSON(jsonGroups.list[0], project),
    createMinidynTestDataLabelsGroupFromJSON(jsonGroups.list[1], project),
    createMinidynZoneDataLabelsGroupFromJSON(jsonGroups.list[2], project),
  ]

  const groups = createSelectableList(list, {
    selectedIndex: jsonGroups.selectedIndex,
  })

  // TODO: Undo deconstruction and add type to function
  return {
    ...createBaseDataLabelsFromJSON(jsonTable, groups),
    groups,
  }
}

export const createMinidynDataLabelsGroupsFromJSON = (
  json: JSONSelectableList<
    JSONMinidynDataLabelsGroup,
    JSONMinidynDataLabelsGroups
  >,
  project: MinidynProject
): SelectableList<MinidynDataLabelsGroup, MinidynDataLabelsGroups> => {
  const list: MinidynDataLabelsGroups = [
    createMinidynDropDataLabelsGroupFromJSON(json.list[0], project),
    createMinidynTestDataLabelsGroupFromJSON(json.list[1], project),
    createMinidynZoneDataLabelsGroupFromJSON(json.list[2], project),
  ]

  return createSelectableList(list, {
    selectedIndex: json.selectedIndex,
  })
}

export const createMinidynDropDataLabelsGroupFromJSON = (
  json: JSONMinidynDropDataLabelsGroup,
  project: MinidynProject
): MinidynDropDataLabelsGroup => {
  const indexes = createSelectableList(
    json.distinct.indexes.list.map((jsonDropIndex) =>
      createMinidynDropIndexFromJSON(jsonDropIndex)
    ),
    {
      selectedIndex: json.distinct.indexes.selectedIndex,
    }
  )

  return {
    ...createBaseDropDataLabelsGroupFromJSON(json.base, project.units, indexes),
    toJSON: function () {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Drop',
          MinidynUnitsNames
        >,
        distinct: {
          version: 1,
          indexes: this.indexes.toJSON((index) => index.toJSON()),
        },
      }
    },
  }
}

export const createMinidynTestDataLabelsGroupFromJSON = (
  json: JSONMinidynTestDataLabelsGroup,
  project: MinidynProject
): MinidynTestDataLabelsGroup => {
  return {
    ...createBaseTestDataLabelsGroupFromJSON(json.base, project.units),
    toJSON: function () {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Test',
          MinidynUnitsNames
        >,
        distinct: {
          version: 1,
        },
      }
    },
  }
}

export const createMinidynZoneDataLabelsGroupFromJSON = (
  json: JSONMinidynZoneDataLabelsGroup,
  project: MinidynProject
): MinidynZoneDataLabelsGroup => {
  return {
    ...createBaseZoneDataLabelsGroupFromJSON(json.base, project.units),
    toJSON: function () {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Zone',
          MinidynUnitsNames
        >,
        distinct: {
          version: 1,
        },
      }
    },
  }
}
