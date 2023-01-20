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

  const label =
    d0DataLabel &&
    createDataLabel(
      'Characteristic deflection',
      report.project.units[unitName],
      unitName,
      indicatorsCategory
    )

  label && report.dataLabels.groups.list[2].choices.list.push(label)

  return createDataComputer({
    label,
    compute: (label) => {
      report.zones.forEach((zone) => {
        const data =
          zone.data.find((data) => data.label === label) ||
          zone.data[zone.data.push(createDataValue(0, label)) - 1]

        console.log('zone data', zone.data)

        const d0s = zone.points
          .map((point) =>
            (point.drops.at(-1) as HeavydynDrop).data.filter(
              (data) => data.label === d0DataLabel
            )
          )
          .flat()

        const d0sMean = average(d0s.map((d0) => d0.value.value))

        const standardDeviation =
          d0s
            .map((d0) => Math.abs(d0sMean - d0.value.value))
            .reduce((total, value) => total + value, 0) / d0s.length

        data.value.updateValue(d0sMean + 2 * standardDeviation)
      })
    },
  })
}
