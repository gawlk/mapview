import { getOwner, runWithOwner } from 'solid-js'
import {
  createDataLabel,
  createDataValue,
  currentCategory,
  rawCategory,
} from '/src/scripts'
import { store } from '/src/store'
import { createLazyMemo } from '@solid-primitives/memo'

export const createHeavydynCurrentLoadDataComputer = (
  report: HeavydynReport,
) => {
  const rawLoadDataLabel = report.dataLabels.findIn('Drop', 'Load', rawCategory)

  if (!rawLoadDataLabel) return

  const indexDataValue = report.dataLabels.groups
    .list()[0]
    .indexes.list()
    .at(-1)?.value

  const currentLoadDataLabel = createDataLabel({
    name: rawLoadDataLabel.name,
    unit: rawLoadDataLabel.unit,
    category: currentCategory,
  })

  report.dataLabels.pushTo('Drop', currentLoadDataLabel)

  const correctionParameters = createLazyMemo(
    () => report.project().correctionParameters,
  )

  const correctedLoad = createLazyMemo(() =>
    correctionParameters().load.source.selected() === 'Sequence' &&
    indexDataValue &&
    indexDataValue.unit === rawLoadDataLabel?.unit
      ? indexDataValue
      : correctionParameters().load.customValue,
  )

  const owner = getOwner()

  createEffect(
    () =>
      store.selectedProject() === report.project() &&
      batch(() =>
        report
          .sortedPoints()
          .flatMap((point) => point.drops)
          .filter((drop) => !drop.dataset.get(currentLoadDataLabel))
          .forEach((drop) =>
            runWithOwner(owner, () => {
              const referenceData = createLazyMemo(() =>
                !correctionParameters().load.active()
                  ? drop.dataset.get(rawLoadDataLabel)!.value
                  : correctedLoad(),
              )

              const currentLoad = createDataValue(
                createLazyMemo(() => referenceData().value()),
                currentLoadDataLabel,
              )

              drop.dataset.set(currentLoadDataLabel, currentLoad)
            }),
          ),
      ),
  )
}
