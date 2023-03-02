import {
  average,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

const getStandardDeviation = (values: number[]) => {
  const n = values.length
  const mean = values.reduce((a, b) => a + b) / n
  return Math.sqrt(
    values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  )
}

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
          .map((d0) => d0.value.value)

        const d0sAverage = average(d0s)

        const value =
          d0s.length <= 1
            ? d0sAverage
            : d0sAverage + 2 * getStandardDeviation(d0s)

        console.log(
          d0s,
          d0sAverage,
          value,
          d0s.length > 1 && getStandardDeviation(d0s)
        )

        data.value.updateValue(value)
      })
    },
  })
}
