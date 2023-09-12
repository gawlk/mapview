import {
  computeAverage,
  computeStandardDeviation,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
  run,
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
      if (!d0DataLabel) return

      report.zones.forEach((zone) => {
        const data =
          zone.dataset.get(label.toString()) ||
          run(() => {
            const dl = createDataValue(0, label)
            zone.dataset.set(label.toString(), dl)
            return dl
          })

        const d0s = zone
          .getExportablePoints()
          .flatMap(
            (point) =>
              (point.drops.at(-1) as HeavydynDrop).dataset
                .get(d0DataLabel?.toString())
                ?.getRawValue() || [],
          )

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
