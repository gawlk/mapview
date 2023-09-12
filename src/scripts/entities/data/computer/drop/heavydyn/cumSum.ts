import {
  computeAverage,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
  run,
} from '/src/scripts'

export const createCumSumDataComputer = (report: HeavydynReport) => {
  const currentD0DataLabel = report.dataLabels.findIn(
    'Drop',
    'D0',
    currentCategory,
  )

  const currentLoadDataLabel = report.dataLabels.findIn(
    'Drop',
    'Load',
    currentCategory,
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
          shortName: 'Cumsum',
          category: indicatorsCategory,
          unit: report.project.units.cumSum,
        }),
      ),
    // eslint-disable-next-line sonarjs/cognitive-complexity
    compute: (label) => {
      const exportablePoints = report.getExportablePoints() as HeavydynPoint[]

      const groupedDropsByDropIndex = exportablePoints.reduce(
        (grouped, point) => {
          point.drops.forEach((drop, dropIndex) =>
            grouped[dropIndex].push(drop),
          )

          return grouped
        },
        new Array(numberOfDrops).fill(null).map(() => []) as HeavydynDrop[][],
      )

      groupedDropsByDropIndex.forEach((drops) => {
        const d0OnLoadList = drops.map((drop) => {
          if (!currentD0DataLabel || !currentLoadDataLabel) return

          const d0 = drop.dataset.get(currentD0DataLabel.toString())

          const load = drop.dataset.get(currentD0DataLabel.toString())

          return d0 && load
            ? (d0.getRawValue() / load.getRawValue()) * 100000000
            : undefined
        })

        const averageD0OnLoad = computeAverage(
          d0OnLoadList.flat().filter((v) => typeof v === 'number') as number[],
        )

        let lastCumSum = 0

        drops.forEach((drop, index) => {
          const data =
            drop.dataset.get(label.toString()) ||
            run(() => {
              const dl = createDataValue(0, label)
              drop.dataset.set(label.toString(), dl)
              return dl
            })

          const d0OnLoad = d0OnLoadList[index]

          if (typeof d0OnLoad === 'number') {
            const value = index
              ? d0OnLoad + lastCumSum - averageD0OnLoad
              : lastCumSum

            lastCumSum = value

            data.value.updateValue(Math.round(value * 10) / 10)
          }
        })
      })
    },
  })
}
