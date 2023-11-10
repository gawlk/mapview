import {
  createASS,
  createDataLabelFromJSON,
  createSL,
  currentCategory,
} from '/src/scripts'

const convertFromToIndex = (from: DataLabelsFrom) => {
  switch (from) {
    case 'Drop':
      return 0
    case 'Point':
      return 1
    case 'Zone':
      return 2
  }
}

export const createBaseDataLabelsFromJSON = (
  jsonTable: JSONSelectableList<JSONTableDataLabelsParameters>,
  groups: SelectableList<AnyBaseDataLabelsGroup, BaseDataLabelsGroups>,
) => {
  const table = createSL(
    createTableDataLabelsFromJSON(jsonTable, groups.list()),
    {
      selectedIndex: jsonTable.selectedIndex,
    },
  )

  const dataLabels: BaseDataLabels = {
    groups,
    table,
    getList: (from: DataLabelsFrom) =>
      groups.list()[convertFromToIndex(from)].choices.list(),
    // Don't need to search by string anymore
    findIn: (from: DataLabelsFrom, name: string, category?: DataCategory) =>
      groups
        .list()
        [convertFromToIndex(from)].choices.list()
        .find(
          (label) =>
            label.name === name &&
            (category ? label.category.name === category.name : true),
        ),
    pushTo: (from: DataLabelsFrom, label: DataLabel) => {
      groups.list()[convertFromToIndex(from)].choices.list.set((l) => {
        l.push(label)
        return l
      })
    },
    toBaseJSON() {
      const selectedTable = table.selected()

      return {
        version: 1,
        table: table.toJSON((params) => ({
          version: 1,
          from: params.group.from,
          dataLabels: params.dataLabels().map((dataLabel) => ({
            version: 1,
            name: dataLabel.name,
            category: dataLabel.category.name,
          })),
          index:
            params.index && selectedTable?.group.from === 'Drop'
              ? selectedTable.group.indexes
                  .list()
                  .findIndex(
                    (index) =>
                      index.displayedIndex === params.index?.().displayedIndex,
                  )
              : undefined,
        })),
      }
    },
  }

  return dataLabels
}

export const createTableDataLabelsFromJSON = (
  json: JSONSelectableList<JSONTableDataLabelsParameters>,
  groups: BaseDataLabelsGroups,
) =>
  groups.map((group) => {
    const tableDataLabels = json.list?.find(
      (_tableDataLabels) => _tableDataLabels.from === group.from,
    )

    const baseParams: BaseTableDataLabelsParameters = {
      group,
      index:
        group.from === 'Drop'
          ? createASS(group.indexes.list()[tableDataLabels?.index || 0])
          : undefined,
      dataLabels: createASS([], {
        equals: false,
      }),
    }

    return baseParams
  })

export const createBaseDataLabelsGroupFromJSON = <
  T extends string,
  From extends DataLabelsFrom,
>(
  json: JSONBaseDataLabelsGroup<From, T>,
  units: MachineMathUnits,
  categorySelector?: CategorySelector,
): BaseDataLabelsGroup<From, T> => {
  const choices = json.choices.list.map((jsonChoice) =>
    createDataLabelFromJSON(
      jsonChoice,
      units,
      categorySelector?.(jsonChoice.unit as MachineUnitsNames) ||
        currentCategory,
    ),
  )

  return {
    from: json.from,
    choices: createSL(choices),
    saveableChoices: [...choices],
    toBaseJSON() {
      return {
        version: 1,
        from: json.from,
        choices: this.choices.toJSON(
          (choice) => choice.toJSON(),
          (label) => this.saveableChoices.includes(label),
        ),
      }
    },
  }
}

export const createBaseDropDataLabelsGroupFromJSON = <
  T extends string,
  DropIndex extends BaseDropIndex,
>(
  json: JSONBaseDataLabelsGroup<'Drop', T>,
  units: MachineMathUnits,
  indexes: SelectableList<DropIndex>,
  categorySelector?: CategorySelector,
): BaseDropDataLabelsGroup<T, DropIndex> => {
  return {
    ...createBaseDataLabelsGroupFromJSON(json, units, categorySelector),
    indexes,
  }
}

export const createBaseTestDataLabelsGroupFromJSON = <T extends string>(
  json: JSONBaseDataLabelsGroup<'Point', T>,
  units: MachineMathUnits,
  categorySelector?: CategorySelector,
): BaseTestDataLabelsGroup<T> => ({
  ...createBaseDataLabelsGroupFromJSON(json, units, categorySelector),
})

export const createBaseZoneDataLabelsGroupFromJSON = <T extends string>(
  json: JSONBaseDataLabelsGroup<'Zone', T>,
  units: MachineMathUnits,
  categorySelector?: CategorySelector,
  // eslint-disable-next-line sonarjs/no-identical-functions
): BaseZoneDataLabelsGroup<T> => ({
  ...createBaseDataLabelsGroupFromJSON(json, units, categorySelector),
})

export const selectTableDataLabelsFromJSON = (
  report: BaseReport,
  json: JSONBaseReport,
) => {
  report.dataLabels.table.list().forEach((parameters) => {
    const { group } = parameters

    const tableDataLabels = json.dataLabels.table.list.find(
      (_tableDataLabels) => _tableDataLabels.from === group.from,
    )

    parameters.dataLabels.set((l) => {
      l.push(
        ...((tableDataLabels?.dataLabels || [])
          .map((dataLabel) =>
            group.choices
              .list()
              .find(
                (choice) =>
                  choice.name === dataLabel.name &&
                  choice.category.name === dataLabel.category,
              ),
          )
          .filter((dataLabel) => dataLabel) as DataLabel<string>[]),
      )

      return l
    })
  })
}
