import {
  createHeavydynDropIndexFromJSON,
  createSL,
  currentCategory,
  rawCategory,
} from '/src/scripts'

import {
  createBaseDataLabelsFromJSON,
  createBaseDropDataLabelsGroupFromJSON,
  createBaseTestDataLabelsGroupFromJSON,
  createBaseZoneDataLabelsGroupFromJSON,
} from '../base'

const heavydynCategorySelector: CategorySelector = (unitKey) =>
  unitKey === 'force' || unitKey === 'deflection'
    ? rawCategory
    : currentCategory

export const createHeavydynDataLabelsFromJSON = (
  jsonGroups: JSONSelectableList<
    JSONHeavydynDataLabelsGroup,
    JSONHeavydynDataLabelsGroups
  >,
  jsonTable: JSONSelectableList<JSONTableDataLabelsParameters>,
  project: HeavydynProject,
): HeavydynDataLabels => {
  const list: HeavydynDataLabelsGroups = [
    createHeavydynDropDataLabelsGroupFromJSON(jsonGroups.list[0], project),
    createHeavydynTestDataLabelsGroupFromJSON(jsonGroups.list[1], project),
    createHeavydynZoneDataLabelsGroupFromJSON(jsonGroups.list[2], project),
  ]

  const groups = createSL(list, {
    selectedIndex: jsonGroups.selectedIndex,
  })

  return {
    ...createBaseDataLabelsFromJSON(jsonTable, groups),
    groups,
  }
}

export const createHeavydynDropDataLabelsGroupFromJSON = (
  json: JSONHeavydynDropDataLabelsGroup,
  project: HeavydynProject,
): HeavydynDropDataLabelsGroup => {
  const indexes = createSL(
    json.distinct.indexes.list.map((jsonDropIndex) =>
      createHeavydynDropIndexFromJSON(jsonDropIndex, {
        project,
      }),
    ),
    {
      selectedIndex: json.distinct.indexes.selectedIndex,
    },
  )

  return {
    ...createBaseDropDataLabelsGroupFromJSON(
      json.base,
      project.units,
      indexes,
      heavydynCategorySelector,
    ),
    sequenceName: json.distinct.sequenceName,
    toJSON() {
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
  project: HeavydynProject,
): HeavydynTestDataLabelsGroup => {
  return {
    ...createBaseTestDataLabelsGroupFromJSON(
      json.base,
      project.units,
      heavydynCategorySelector,
    ),
    toJSON() {
      return {
        version: 1,
        base: this.toBaseJSON() as JSONBaseDataLabelsGroup<
          'Point',
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
  project: HeavydynProject,
): HeavydynZoneDataLabelsGroup => {
  return {
    ...createBaseZoneDataLabelsGroupFromJSON(json.base, project.units),
    toJSON() {
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

export const selectHeavydynGroupChoiceFromJSON = (
  report: HeavydynReport,
  json: JSONHeavydynReport,
) => {
  report.dataLabels.groups.list().forEach((group, index) => {
    const indexD0 = group.choices
      .list()
      .findIndex(
        (dataLabel) =>
          dataLabel.name === 'D0' && dataLabel.category === currentCategory,
      )

    group.choices.selectIndex(
      json.distinct.dataLabels.list[index].base.choices.selectedIndex ??
        (indexD0 === -1 ? 0 : indexD0),
    )

    !group.choices.selected() && group.choices.selectIndex(0)
  })
}
