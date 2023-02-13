import {
  createDataLabelFromJSON,
  createSelectableList,
  currentCategory,
  rawCategory,
} from '/src/scripts'

const convertFromToIndex = (from: DataLabelsFrom) =>
  from === 'Drop' ? 0 : from === 'Test' ? 1 : 2

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
  units: MachineMathUnits
): BaseDataLabelsGroup<From> => {
  return {
    from: json.from,
    choices: createSelectableList(
      json.choices.list.map((jsonChoice) => {
        const unitKey = jsonChoice.unit as MachineUnitsNames
        return createDataLabelFromJSON(
          jsonChoice,
          units,
          unitKey === 'force' || unitKey === 'deflection'
            ? rawCategory
            : currentCategory
        )
      }) || []
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
