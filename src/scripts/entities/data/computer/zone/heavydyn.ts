import {
  computeAverage,
  computeStandardDeviation,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

export const createCharacteristicDeflectionComputer = (
  report: HeavydynReport,
) => {
  const unitName: HeavydynUnitsNames = 'deflection'

  const d0DataLabel = report.dataLabels.groups.list[0].choices.list.find(
    (label) =>
      label.name === 'D0' && label.category.name === currentCategory.name,
  )

  return createDataComputer({
    label:
      d0DataLabel &&
      report.dataLabels.pushTo(
        'Zone',
        createDataLabel({
          name: 'Characteristic deflection',
          unit: report.project.units[unitName],
          unitKey: unitName,
          category: indicatorsCategory,
        }),
      ),
    compute: (label) => {
      report.zones.forEach((zone) => {
        const data =
          zone.data.find((_data) => _data.label === label) ||
          zone.data[zone.data.push(createDataValue(0, label)) - 1]

        const d0s = zone
          .getExportablePoints()
          .map((point) =>
            (point.drops.at(-1) as HeavydynDrop).data.filter(
              (_data) => _data.label === d0DataLabel,
            ),
          )
          .flat()
          .map((d0) => d0.getRawValue())

        const d0sAverage = computeAverage(d0s)

        const value =
          d0s.length <= 1
            ? d0sAverage
            : d0sAverage + 2 * computeStandardDeviation(d0s)

        data.value.updateValue(value)
      })
    },
  })
}
