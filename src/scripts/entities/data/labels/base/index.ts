import {
  createDataLabelFromJSON,
  createSelectableList,
  rawCategory,
} from '/src/scripts'

export const createBaseDataLabelsFromJSON = (
  jsonTable: JSONSelectableList<JSONTableDataLabelsParameters>,
  groups: SelectableList<AnyBaseDataLabelsGroup, BaseDataLabelsGroups>
): BaseDataLabels => {
  const table = createSelectableList(
    createTableDataLabelsFromJSON(jsonTable, groups.list),
    {
      selectedIndex: jsonTable.selectedIndex,
    }
  )

  return shallowReactive({
    groups,
    table,
    toBaseJSON: function () {
      return {
        version: 1,
        table: table.toJSON((params) => {
          return {
            version: 1,
            from: params.group.from,
            dataLabels: params.dataLabels.map((dataLabels) => dataLabels.name),
            index:
              params.index && table.selected?.group.from === 'Drop'
                ? table.selected.group.indexes.list.indexOf(params.index)
                : undefined,
          }
        }),
      }
    },
  })
}

export const createTableDataLabelsFromJSON = (
  json: JSONSelectableList<JSONTableDataLabelsParameters>,
  groups: BaseDataLabelsGroups
): BaseTableDataLabelsParameters[] => {
  const tableDataLabelsList = groups.map((group) => {
    const tableDataLabels = json.list?.find(
      (tableDataLabels) => tableDataLabels.from === group.from
    )

    return shallowReactive({
      group,
      index:
        group.from === 'Drop'
          ? group.indexes.list[tableDataLabels?.index || 0]
          : undefined,
      dataLabels: shallowReactive(
        (tableDataLabels?.dataLabels || [])
          .map((name) =>
            group.choices.list.find((choice) => choice.name === name)
          )
          .filter((dataLabel) => dataLabel) as DataLabel<string>[]
      ),
    })
  })

  return tableDataLabelsList
}

export const createBaseDataLabelsGroupFromJSON = <
  T extends string,
  From extends DataLabelsFrom
>(
  json: JSONBaseDataLabelsGroup<From, T>,
  units: MachineMathUnits
): BaseDataLabelsGroup<From> => {
  return {
    from: json.from,
    choices: createSelectableList(
      json.choices.list.map((jsonChoice) =>
        createDataLabelFromJSON(jsonChoice, units, rawCategory)
      ) || [],
      {
        selectedIndex: json.choices.selectedIndex,
      }
    ),
    toBaseJSON: function () {
      return {
        version: 1,
        from: json.from,
        choices: this.choices.toJSON((choice) => choice.toJSON()),
      }
    },
  }
}

export const createBaseDropDataLabelsGroupFromJSON = <
  T extends string,
  DropIndex extends BaseDropIndex
>(
  json: JSONBaseDataLabelsGroup<'Drop', T>,
  units: MachineMathUnits,
  indexes: SelectableList<DropIndex>
): BaseDropDataLabelsGroup<DropIndex> => {
  return {
    ...createBaseDataLabelsGroupFromJSON(json, units),
    indexes,
  }
}

export const createBaseTestDataLabelsGroupFromJSON = <T extends string>(
  json: JSONBaseDataLabelsGroup<'Test', T>,
  units: MachineMathUnits
): BaseTestDataLabelsGroup => {
  return {
    ...createBaseDataLabelsGroupFromJSON(json, units),
  }
}

export const createBaseZoneDataLabelsGroupFromJSON = <T extends string>(
  json: JSONBaseDataLabelsGroup<'Zone', T>,
  units: MachineMathUnits
): BaseZoneDataLabelsGroup => {
  return {
    ...createBaseDataLabelsGroupFromJSON(json, units),
  }
}
