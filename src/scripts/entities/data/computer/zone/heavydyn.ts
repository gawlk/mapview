import { getOwner, runWithOwner } from 'solid-js'
import {
  computeAverage,
  computeStandardDeviation,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'
import { store } from '/src/store'
import { createLazyMemo } from '@solid-primitives/memo'

export const CHARACTERISTIC_DEFLECTION_NAME = 'Characteristic deflection'

export const createCharacteristicDeflectionComputer = (
  report: HeavydynReport,
) => {
  const unitName: HeavydynUnitsNames = 'deflection'

  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  if (!d0DataLabel) return

  const charDefDataLabel = createDataLabel({
    name: CHARACTERISTIC_DEFLECTION_NAME,
    unit: report.project().units[unitName],
    unitKey: unitName,
    category: indicatorsCategory,
  })

  report.dataLabels.pushTo('Zone', charDefDataLabel)

  const owner = getOwner()

  createEffect(
    () =>
      store.selectedProject() === report.project() &&
      batch(() =>
        report
          .zones()
          .filter((zone) => !zone.dataset.get(charDefDataLabel))
          .forEach((zone) =>
            runWithOwner(owner, () => {
              const d0s = createLazyMemo(() =>
                zone
                  .exportablePoints()
                  .flatMap(
                    (point) =>
                      (point.drops.at(-1) as HeavydynDrop).dataset
                        .get(d0DataLabel)
                        ?.rawValue() || [],
                  ),
              )

              const d0sAverage = createLazyMemo(() => computeAverage(d0s()))

              const standardDeviation = createLazyMemo(() =>
                computeStandardDeviation(d0s()),
              )

              const charDef = createDataValue(
                createLazyMemo(() =>
                  d0s().length <= 1
                    ? d0sAverage()
                    : d0sAverage() + 2 * standardDeviation(),
                ),
                charDefDataLabel,
              )

              zone.dataset.set(charDefDataLabel, charDef)
            }),
          ),
      ),
  )
}
