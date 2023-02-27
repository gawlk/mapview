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
  const currentD0DataLabel = report.dataLabels.findIn(
    'Drop',
    'D0',
    currentCategory
  )

  const currentLoadDataLabel = report.dataLabels.findIn(
    'Drop',
    'Load',
    currentCategory
  )

  const numberOfDrops = report.dataLabels.groups.list[0].indexes.list.length

  return createDataComputer({
    label:
      currentD0DataLabel &&
      currentLoadDataLabel &&
      report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: 'Cumulative sum',
          category: indicatorsCategory,
          unit: report.project.units.cumSum,
        })
      ),
    compute: (label) => {
      report.zones.forEach((zone) => {
        const groupedDropsByDropIndex = zone.points.reduce((grouped, point) => {
          point.drops.forEach((drop, dropIndex) =>
            grouped[dropIndex].push(drop)
          )

          return grouped
        }, new Array(numberOfDrops).fill(null).map(() => []) as HeavydynDrop[][])

        groupedDropsByDropIndex.slice(-1).forEach((drops) => {
          const d0OnLoadList = drops.map((drop) => {
            const d0 = drop.data.find(
              (data) => data.label === currentD0DataLabel
            )

            const load = drop.data.find(
              (data) => data.label === currentLoadDataLabel
            )

            return d0 && load
              ? (d0.value.value / load.value.value) * 100000000
              : undefined
          })

          const averageD0OnLoad = average(
            d0OnLoadList.flat().filter((v) => typeof v === 'number') as number[]
          )

          let lastCumSum = 0

          drops.forEach((drop, index) => {
            const data =
              drop.data.find((data) => data.label === label) ||
              drop.data[drop.data.push(createDataValue(0, label)) - 1]

            const d0OnLoad = d0OnLoadList[index]

            if (index > 0 && typeof d0OnLoad === 'number') {
              const value = d0OnLoad + lastCumSum - averageD0OnLoad

              lastCumSum = value

              data.value.updateValue(Math.floor(value * 10) / 10)
            }
          })
        })
      })
    },
  })
}
