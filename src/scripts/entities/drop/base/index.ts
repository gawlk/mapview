import { createMathNumber } from '/src/scripts'

export const createBaseDropFromJSON = (
  json: JSONDrop,
  parameters: BaseDropCreatorParameters
): BaseDrop => {
  const dropList = parameters.point.zone.report.dataLabels.groups.list.find(
    (groupedDataLabels) => groupedDataLabels.from === 'Drop'
  ) as GroupedDataLabels

  const index = dropList.indexes?.list[json.index] as MachineDropIndex

  return {
    index,
    data: json.data.map((jsonDataValue): DataValue => {
      const label = dropList.choices.list.find(
        (dataLabel) => dataLabel.name === jsonDataValue.label
      ) as DataLabel

      return {
        label,
        value: createMathNumber(jsonDataValue.value, label.unit),
      }
    }),
    additionnalFields: [],
    point: parameters.point,
    impactData: null,
  }
}
