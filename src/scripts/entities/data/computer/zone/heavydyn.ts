import {
  average,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

export const createCharacteristicDeflectionComputer = (
  report: HeavydynReport
) => {
  const unitName: HeavydynUnitsNames = 'deflection'

  const d0DataLabel = report.dataLabels.groups.list[0].choices.list.find(
    (label) => label.name === 'D0' && label.category === currentCategory
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
        })
      ),
    compute: (label) => {
      report.zones.forEach((zone) => {
        const data =
          zone.data.find((data) => data.label === label) ||
          zone.data[zone.data.push(createDataValue(0, label)) - 1]

        const d0s = zone.points
          .map((point) =>
            (point.drops.at(-1) as HeavydynDrop).data.filter(
              (data) => data.label === d0DataLabel
            )
          )
          .flat()

        const d0sAverage = average(d0s.map((d0) => d0.value.value))

        const value = Math.sqrt(
          (1 / (d0s.length - 1)) *
            d0s
              .map((d0) => (d0sAverage - d0.value.value) ** 2)
              .reduce((total, value) => total + value, 0)
        )

        data.value.updateValue(value)
      })
    },
  })
}
