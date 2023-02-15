import {
  createDataLabelFromJSON,
  createSelectableList,
  currentCategory,
  rawCategory,
} from '/src/scripts'

const convertFromToIndex = (from: DataLabelsFrom) =>
  from === 'Drop' ? 0 : from === 'Point' ? 1 : 2

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
    getList: (from: DataLabelsFrom) =>
      groups.list[convertFromToIndex(from)].choices.list,
    findIn: (from: DataLabelsFrom, name: string, category?: DataCategory) =>
      groups.list[convertFromToIndex(from)].choices.list.find(
        (label) =>
          label.name === name && (category ? label.category === category : true)
      ),
    pushTo: (from: DataLabelsFrom, label: DataLabel) =>
      groups.list[convertFromToIndex(from)].choices.list.push(label)
        ? label
        : undefined,
    toBaseJSON: function () {
      return {
        version: 1,
        table: table.toJSON((params) => ({
          version: 1,
          from: params.group.from,
          dataLabels: params.dataLabels.map((dataLabels) => ({
            version: 1,
            name: dataLabels.name,
            category: dataLabels.category.name,
          })),
          index:
            params.index && table.selected?.group.from === 'Drop'
              ? table.selected.group.indexes.list.indexOf(params.index)
              : undefined,
        })),
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
      dataLabels: shallowReactive([]),
    })
  })

  return tableDataLabelsList
}

export const createBaseDataLabelsGroupFromJSON = <
  T extends string,
  From extends DataLabelsFrom
>(
  json: JSONBaseDataLabelsGroup<From, T>,
  units: MachineMathUnits,
  categorySelector?: (unitKey: MachineUnitsNames) => DataCategory
): BaseDataLabelsGroup<From> => {
  return {
    from: json.from,
    choices: createSelectableList(
      json.choices.list.map((jsonChoice) =>
        createDataLabelFromJSON(
          jsonChoice,
          units,
          categorySelector?.(jsonChoice.unit as MachineUnitsNames) ||
            currentCategory
        )
      )
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
  indexes: SelectableList<DropIndex>,
  categorySelector?: (unitKey: MachineUnitsNames) => DataCategory
): BaseDropDataLabelsGroup<DropIndex> => {
  return {
    ...createBaseDataLabelsGroupFromJSON(json, units, categorySelector),
    indexes,
  }
}

export const createBaseTestDataLabelsGroupFromJSON = <T extends string>(
  json: JSONBaseDataLabelsGroup<'Point', T>,
  units: MachineMathUnits,
  categorySelector?: (unitKey: MachineUnitsNames) => DataCategory
): BaseTestDataLabelsGroup => {
  return {
    ...createBaseDataLabelsGroupFromJSON(json, units, categorySelector),
  }
}

export const createBaseZoneDataLabelsGroupFromJSON = <T extends string>(
  json: JSONBaseDataLabelsGroup<'Zone', T>,
  units: MachineMathUnits,
  categorySelector?: (unitKey: MachineUnitsNames) => DataCategory
): BaseZoneDataLabelsGroup => {
  return {
    ...createBaseDataLabelsGroupFromJSON(json, units, categorySelector),
  }
}

export const selectTableDataLabelsFromJSON = (
  report: BaseReport,
  json: JSONBaseReport
) => {
  report.dataLabels.table.list.forEach((parameters) => {
    const { group } = parameters

    const tableDataLabels = json.dataLabels.table.list.find(
      (tableDataLabels) => tableDataLabels.from === group.from
    )

    parameters.dataLabels.push(
      ...((tableDataLabels?.dataLabels || [])
        .map((dataLabel) =>
          group.choices.list.find(
            (choice) =>
              choice.name === dataLabel.name &&
              choice.category.name === dataLabel.category
          )
        )
        .filter((dataLabel) => dataLabel) as DataLabel<string>[])
    )
  })
}
