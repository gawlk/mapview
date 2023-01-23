import {
  createHeavydynDropIndexFromJSON,
  createSelectableList,
} from '/src/scripts'

import {
  createBaseDataLabelsFromJSON,
  createBaseDropDataLabelsGroupFromJSON,
  createBaseTestDataLabelsGroupFromJSON,
  createBaseZoneDataLabelsGroupFromJSON,
} from '../base'

export const createHeavydynDataLabelsFromJSON = (
  jsonGroups: JSONSelectableList<
    JSONHeavydynDataLabelsGroup,
    JSONHeavydynDataLabelsGroups
  >,
  jsonTable: JSONSelectableList<JSONTableDataLabelsParameters>,
  project: HeavydynProject
): HeavydynDataLabels => {
  const list: HeavydynDataLabelsGroups = [
    createHeavydynDropDataLabelsGroupFromJSON(jsonGroups.list[0], project),
    createHeavydynTestDataLabelsGroupFromJSON(jsonGroups.list[1], project),
    createHeavydynZoneDataLabelsGroupFromJSON(jsonGroups.list[2], project),
  ]

  const groups = createSelectableList(list, {
    selectedIndex: jsonGroups.selectedIndex,
  })

  return {
    ...createBaseDataLabelsFromJSON(jsonTable, groups),
    groups,
  }
}

export const createHeavydynDropDataLabelsGroupFromJSON = (
  json: JSONHeavydynDropDataLabelsGroup,
  project: HeavydynProject
): HeavydynDropDataLabelsGroup => {
  const indexes = createSelectableList(
    json.distinct.indexes.list.map((jsonDropIndex) =>
      createHeavydynDropIndexFromJSON(jsonDropIndex, {
        project,
      })
    ),
    {
      selectedIndex: json.distinct.indexes.selectedIndex,
    }
  )

  return {
    ...createBaseDropDataLabelsGroupFromJSON(json.base, project.units, indexes),
    sequenceName: json.distinct.sequenceName,
    toJSON: function () {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Drop',
          HeavydynUnitsNames
        >,
        distinct: {
          version: 1,
          indexes: this.indexes.toJSON((index) => index.toJSON()),
          sequenceName: this.sequenceName,
        },
      }
    },
  }
}

export const createHeavydynTestDataLabelsGroupFromJSON = (
  json: JSONHeavydynTestDataLabelsGroup,
  project: HeavydynProject
): HeavydynTestDataLabelsGroup => {
  return {
    ...createBaseTestDataLabelsGroupFromJSON(json.base, project.units),
    toJSON: function () {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Test',
          HeavydynUnitsNames
        >,
        distinct: {
          version: 1,
        },
      }
    },
  }
}

export const createHeavydynZoneDataLabelsGroupFromJSON = (
  json: JSONHeavydynZoneDataLabelsGroup,
  project: HeavydynProject
): HeavydynZoneDataLabelsGroup => {
  return {
    ...createBaseZoneDataLabelsGroupFromJSON(json.base, project.units),
    toJSON: function () {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Zone',
          HeavydynUnitsNames
        >,
        distinct: {
          version: 1,
        },
      }
    },
  }
}