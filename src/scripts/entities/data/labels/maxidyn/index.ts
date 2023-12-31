import { createMaxidynDropIndexFromJSON, createSL } from '/src/scripts'

import {
  createBaseDataLabelsFromJSON,
  createBaseDropDataLabelsGroupFromJSON,
  createBaseTestDataLabelsGroupFromJSON,
  createBaseZoneDataLabelsGroupFromJSON,
} from '../base'

export const createMaxidynDataLabelsFromJSON = (
  jsonGroups: JSONSelectableList<
    JSONMaxidynDataLabelsGroup,
    JSONMaxidynDataLabelsGroups
  >,
  jsonTable: JSONSelectableList<JSONTableDataLabelsParameters>,
  project: MaxidynProject,
): MaxidynDataLabels => {
  const list: MaxidynDataLabelsGroups = [
    createMaxidynDropDataLabelsGroupFromJSON(jsonGroups.list[0], project),
    createMaxidynTestDataLabelsGroupFromJSON(jsonGroups.list[1], project),
    createMaxidynZoneDataLabelsGroupFromJSON(jsonGroups.list[2], project),
  ]

  const groups = createSL(list, {
    selectedIndex: jsonGroups.selectedIndex,
  })

  return {
    ...createBaseDataLabelsFromJSON(jsonTable, groups),
    groups,
  }
}

export const createMaxidynDataLabelsGroupsFromJSON = (
  json: JSONSelectableList<
    JSONMaxidynDataLabelsGroup,
    JSONMaxidynDataLabelsGroups
  >,
  project: MaxidynProject,
): SelectableList<MaxidynDataLabelsGroup, MaxidynDataLabelsGroups> => {
  const list: MaxidynDataLabelsGroups = [
    createMaxidynDropDataLabelsGroupFromJSON(json.list[0], project),
    createMaxidynTestDataLabelsGroupFromJSON(json.list[1], project),
    createMaxidynZoneDataLabelsGroupFromJSON(json.list[2], project),
  ]

  return createSL(list, {
    selectedIndex: json.selectedIndex,
  })
}

export const createMaxidynDropDataLabelsGroupFromJSON = (
  json: JSONMaxidynDropDataLabelsGroup,
  project: MaxidynProject,
): MaxidynDropDataLabelsGroup => {
  const indexes = createSL(
    json.distinct.indexes.list.map((jsonDropIndex) =>
      createMaxidynDropIndexFromJSON(jsonDropIndex),
    ),
    {
      selectedIndex: json.distinct.indexes.selectedIndex,
    },
  )

  return {
    ...createBaseDropDataLabelsGroupFromJSON(json.base, project.units, indexes),
    toJSON() {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Drop',
          MaxidynUnitsNames
        >,
        distinct: {
          version: 1,
          indexes: this.indexes.toJSON((index) => index.toJSON()),
        },
      }
    },
  }
}

export const createMaxidynTestDataLabelsGroupFromJSON = (
  json: JSONMaxidynTestDataLabelsGroup,
  project: MaxidynProject,
): MaxidynTestDataLabelsGroup => {
  return {
    ...createBaseTestDataLabelsGroupFromJSON(json.base, project.units),
    toJSON() {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Point',
          MaxidynUnitsNames
        >,
        distinct: {
          version: 1,
        },
      }
    },
  }
}

export const createMaxidynZoneDataLabelsGroupFromJSON = (
  json: JSONMaxidynZoneDataLabelsGroup,
  project: MaxidynProject,
): MaxidynZoneDataLabelsGroup => {
  return {
    ...createBaseZoneDataLabelsGroupFromJSON(json.base, project.units),
    toJSON() {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Zone',
          MaxidynUnitsNames
        >,
        distinct: {
          version: 1,
        },
      }
    },
  }
}

export const selectMaxidynGroupChoiceFromJSON = (
  report: MaxidynReport,
  json: JSONMaxidynReport,
) => {
  report.dataLabels.groups.list().forEach((group, index) => {
    const indexModulus = group.choices
      .list()
      .findIndex((dataLabel) => dataLabel.name === 'Modulus')

    const jsonIndex =
      json.distinct.dataLabels.list[index].base.choices.selectedIndex

    group.choices.selectIndex(
      jsonIndex ?? (indexModulus === -1 ? 0 : indexModulus),
    )

    !group.choices.selected() && group.choices.selectIndex(0)
  })
}
