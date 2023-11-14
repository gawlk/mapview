import { runWithOwner, getOwner } from 'solid-js'
import {
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'
import { store } from '/src/store'
import { createLazyMemo } from '@solid-primitives/memo'

export const createBLIDataComputer = (report: HeavydynReport) => {
  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  const d300DataLabel = report.dataLabels.findIn(
    'Drop',
    'D300',
    currentCategory,
  )

  if (!d0DataLabel || !d300DataLabel) return

  const bliDataLabel = createDataLabel({
    name: 'BLI (Base layer index)',
    shortName: 'BLI',
    unit: d0DataLabel.unit,
    category: indicatorsCategory,
  })

  report.dataLabels.pushTo('Drop', bliDataLabel)

  layerIndexCompute(report, bliDataLabel, d0DataLabel, d300DataLabel)
}

export const createMLIDataComputer = (report: HeavydynReport) => {
  const d300DataLabel = report.dataLabels.findIn(
    'Drop',
    'D300',
    currentCategory,
  )

  const d600DataLabel = report.dataLabels.findIn(
    'Drop',
    'D600',
    currentCategory,
  )

  if (!d300DataLabel || !d600DataLabel) return

  const mliDataLabel = createDataLabel({
    name: 'MLI (Middle layer index)',
    shortName: 'MLI',
    unit: d300DataLabel.unit,
    category: indicatorsCategory,
  })

  report.dataLabels.pushTo('Drop', mliDataLabel)

  layerIndexCompute(report, mliDataLabel, d300DataLabel, d600DataLabel)
}

export const createLLIDataComputer = (report: HeavydynReport) => {
  const d600DataLabel = report.dataLabels.findIn(
    'Drop',
    'D600',
    currentCategory,
  )

  const d900DataLabel = report.dataLabels.findIn(
    'Drop',
    'D900',
    currentCategory,
  )

  if (!d600DataLabel || !d900DataLabel) return

  const lliDataLabel = createDataLabel({
    name: 'LLI (Lower layer index)',
    shortName: 'LLI',
    unit: d600DataLabel.unit,
    category: indicatorsCategory,
  })

  report.dataLabels.pushTo('Drop', lliDataLabel)

  layerIndexCompute(report, lliDataLabel, d600DataLabel, d900DataLabel)
}

const layerIndexCompute = (
  report: HeavydynReport,
  liDataLabel: DataLabel,
  d1DataLabel: DataLabel,
  d2DataLabel: DataLabel,
) => {
  const owner = getOwner()

  createEffect(
    () =>
      store.selectedProject() === report.project() &&
      batch(() =>
        report
          .sortedPoints()
          .flatMap((point) => point.drops)
          .filter((drop) => !drop.dataset.get(liDataLabel))
          .forEach((drop) =>
            runWithOwner(owner, () => {
              const d1 = createLazyMemo(() =>
                drop.dataset.get(d1DataLabel)!.rawValue(),
              )

              const d2 = createLazyMemo(() =>
                drop.dataset.get(d2DataLabel)!.rawValue(),
              )

              const li = createDataValue(
                createLazyMemo(() => d1() - d2()),
                liDataLabel,
              )

              drop.dataset.set(liDataLabel, li)
            }),
          ),
      ),
  )
}
