import { getOwner, runWithOwner } from 'solid-js'
import {
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'
import { store } from '/src/store'
import { createLazyMemo } from '@solid-primitives/memo'

export const createCurvatureRadiusDataComputers = (report: HeavydynReport) => {
  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  if (!d0DataLabel) return

  const owner = getOwner()

  return [
    {
      side: 'Front',
      deflectionDataLabel:
        report.dataLabels.findIn('Drop', 'D200', currentCategory) ||
        report.dataLabels.findIn('Drop', 'D300', currentCategory),
    },
    {
      side: 'Back',
      deflectionDataLabel:
        report.dataLabels.findIn('Drop', 'D-200', currentCategory) ||
        report.dataLabels.findIn('Drop', 'D-300', currentCategory),
    },
  ].forEach(({ side, deflectionDataLabel }) => {
    if (!deflectionDataLabel) return

    const crDataLabel = createDataLabel({
      name: `Curvature radius (${side})`,
      shortName: `Cr${side.toLowerCase()}`,
      unit: report.project().units.radius,
      category: indicatorsCategory,
    })

    report.dataLabels.pushTo('Drop', crDataLabel)

    createEffect(
      () =>
        store.selectedProject() === report.project() &&
        batch(() =>
          report
            .sortedPoints()
            .flatMap((point) => point.drops)
            .filter((drop) => !drop.dataset.get(crDataLabel))
            .forEach((drop) =>
              runWithOwner(owner, () => {
                const d0ValueInMeters = createLazyMemo(() =>
                  drop.dataset.get(d0DataLabel)!.value.getValueAs('m'),
                )

                const deflection = createLazyMemo(
                  () => drop.dataset.get(deflectionDataLabel)!,
                )

                const cr = createDataValue(
                  createLazyMemo(
                    () =>
                      (0 -
                        Number(deflection().label.name.slice(1)) * 10 ** -3) **
                        2 /
                      (2 *
                        (d0ValueInMeters() -
                          deflection().value.getValueAs('m'))),
                  ),
                  crDataLabel,
                )

                drop.dataset.set(crDataLabel, cr)
              }),
            ),
        ),
    )
  })
}
