import { getOwner, runWithOwner } from 'solid-js'
import {
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'
import { store } from '/src/store'
import { createLazyMemo } from '@solid-primitives/memo'

export const createHeavydynSurfaceModulusDataComputers = (
  report: HeavydynReport,
) => {
  const unitName: HeavydynUnitsNames = 'modulus'

  const currentD0DataLabel = report.dataLabels.findIn(
    'Drop',
    'DO',
    currentCategory,
  )
  const currentLoadDataLabel = report.dataLabels.findIn(
    'Drop',
    'Load',
    currentCategory,
  )

  if (!currentD0DataLabel || !currentLoadDataLabel) return

  const sm0DataLabel = createDataLabel({
    name: `SM0`,
    unit: report.project().units[unitName],
    unitKey: unitName,
    category: indicatorsCategory,
  })

  report.dataLabels.pushTo('Drop', sm0DataLabel)

  const radius = createLazyMemo(() => report.project().calibrations.dPlate / 2)

  const poisson = 0.35

  const owner = getOwner()

  createEffect(
    () =>
      store.selectedProject() === report.project() &&
      batch(() =>
        report
          .sortedPoints()
          .flatMap((point) => point.drops)
          .filter((drop) => !drop.dataset.get(sm0DataLabel))
          .forEach((drop) =>
            runWithOwner(owner, () => {
              const load = createLazyMemo(() =>
                drop.dataset.get(currentLoadDataLabel)!.rawValue(),
              )

              const pressure = createLazyMemo(
                () => load() / (Math.PI * radius() ** 2),
              )

              const sm0 = createDataValue(
                createLazyMemo(() => 2 * pressure() * (1 - poisson) * radius()),
                sm0DataLabel,
              )

              drop.dataset.set(sm0DataLabel, sm0)
            }),
          ),
      ),
  )
}
