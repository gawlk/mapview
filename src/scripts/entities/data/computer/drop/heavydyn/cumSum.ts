import { getOwner, runWithOwner } from 'solid-js'
import {
  computeAverage,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
  roundValue,
} from '/src/scripts'
import { store } from '/src/store'
import { createLazyMemo } from '@solid-primitives/memo'

// eslint-disable-next-line sonarjs/cognitive-complexity
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

  if (!currentD0DataLabel || !currentLoadDataLabel) return

  const numberOfDrops = report.dataLabels.groups.list()[0].indexes.list().length

  const cumSumDataLabel = createDataLabel({
    name: 'Cumulative sum',
    shortName: 'Cumsum',
    category: indicatorsCategory,
    unit: report.project().units.cumSum,
  })

  report.dataLabels.pushTo('Drop', cumSumDataLabel)

  const points = report.sortedPoints as Accessor<HeavydynPoint[]>

  const groupedDropsByDropIndex = createLazyMemo(() =>
    points().reduce(
      (grouped, point) => {
        point.drops.forEach((drop, dropIndex) => grouped[dropIndex].push(drop))
        return grouped
      },
      new Array(numberOfDrops).fill(null).map(() => []) as HeavydynDrop[][],
    ),
  )

  const d0OnLoadByDropIndexList = createLazyMemo(() =>
    groupedDropsByDropIndex().map((drops) =>
      drops.map((drop) => {
        const d0 = createLazyMemo(
          () => drop.dataset.get(currentD0DataLabel)?.rawValue(),
        )

        const load = createLazyMemo(
          () => drop.dataset.get(currentLoadDataLabel)?.rawValue(),
        )

        return ((d0() || 0) / (load() || 0)) * 100_000_000
      }),
    ),
  )

  const d0OnLoadAverages = createLazyMemo(() =>
    d0OnLoadByDropIndexList().map((group) => computeAverage(group)),
  )

  const owner = getOwner()

  createEffect(
    () =>
      store.selectedProject() === report.project() &&
      batch(() =>
        groupedDropsByDropIndex().forEach((group, groupIndex) =>
          group
            .filter((drop) => !drop.dataset.get(cumSumDataLabel))
            .forEach((drop, dropIndex, drops) =>
              runWithOwner(owner, () => {
                const d0OnLoad = createLazyMemo(
                  () => d0OnLoadByDropIndexList()[groupIndex][dropIndex],
                )

                const averageD0OnLoad = createLazyMemo(
                  () => d0OnLoadAverages()[groupIndex],
                )

                const previousCumSum = createLazyMemo(() => {
                  if (!dropIndex) return 0
                  return (
                    drops[dropIndex - 1].dataset
                      .get(cumSumDataLabel)
                      ?.rawValue() || 0
                  )
                })

                const cumSum = createDataValue(
                  createLazyMemo(() =>
                    roundValue(
                      dropIndex
                        ? d0OnLoad() + previousCumSum() - averageD0OnLoad()
                        : 0,
                      1,
                    ),
                  ),
                  cumSumDataLabel,
                )

                drop.dataset.set(cumSumDataLabel, cumSum)
              }),
            ),
        ),
      ),
  )
}
