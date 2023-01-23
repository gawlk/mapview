import {
  average,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
  rawCategory,
} from '/src/scripts'

export const createCumSumDataComputer = (report: HeavydynReport) => {
  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  const loadDataLabel = report.dataLabels.findIn('Drop', 'Load', rawCategory)

  return createDataComputer({
    label:
      d0DataLabel &&
      loadDataLabel &&
      report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: 'Cumulative Sum',
          category: indicatorsCategory,
        })
      ),
    compute: (label) => {
      report.zones.forEach((zone) =>
        zone.points.forEach((point) => {
          const d0s = point.drops
            .map((drop) => {
              const d0 = drop.data.find((data) => data.label === d0DataLabel)

              const load = drop.data.find(
                (data) => data.label === loadDataLabel
              )

              return d0 && load ? d0.value.value : undefined
            })
            .flat(Infinity)
            .filter((v) => typeof v === 'number') as number[]

          const averageD0 = average(d0s)

          let lastCumSum = 0

          point.drops.forEach((drop, index) => {
            const data =
              drop.data.find((data) => data.label === label) ||
              drop.data[drop.data.push(createDataValue(0, label)) - 1]

            if (index > 0) {
              const value = (lastCumSum + d0s[index] - averageD0) / averageD0

              lastCumSum = value

              data.value.updateValue(value)
            }
          })
        })
      )
    },
  })

  // Sans unité
  //
  //
  //
  // const unitName: HeavydynUnitsNames = 'deflection'
  // const labels = report.dataLabels.groups.list[0].choices.list
  // return {
  //   label: createDataLabel(
  //     'Cumulative Sum',
  //     units[unitName],
  //     unitName,
  //     indicatorsCategory
  //   ),
  //   createDataValueTuple: function () {
  //     if (this.label) {
  //       const dataValue = createDataValue(0, this.label)
  //       const update = () => dataValue.value.updateValue(0)
  //       // Cumsum ZH = cumsum
  //       // check excel pour la formule
  //       return [dataValue, update]
  //     } else {
  //       return []
  //     }
  //   },
  // }
}
