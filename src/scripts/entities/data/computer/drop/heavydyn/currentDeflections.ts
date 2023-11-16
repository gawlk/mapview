import { getOwner, runWithOwner } from 'solid-js'
import {
  computeAverage,
  createDataLabel,
  createDataValue,
  currentCategory,
  rawCategory,
} from '/src/scripts'
import { store } from '/src/store'
import { createLazyMemo } from '@solid-primitives/memo'

export const createHeavydynCurrentDeflectionDropDataComputers = (
  report: HeavydynReport,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const rawLoadDataLabel = report.dataLabels.findIn('Drop', 'Load', rawCategory)

  const currentLoadDataLabel = report.dataLabels.findIn(
    'Drop',
    'Load',
    currentCategory,
  )

  if (!rawLoadDataLabel || !currentLoadDataLabel) return

  const { temperature } = report.project().correctionParameters

  const tempDataLabel = createLazyMemo(() =>
    report.dataLabels.groups
      .list()[1]
      .choices.list()
      .find((dataLabel) => dataLabel.name === temperature.source.selected()),
  )

  const sourceTempMatrix = createLazyMemo(() => {
    const dl = tempDataLabel()
    return report
      .zones()
      .map((zone) =>
        zone
          .exportablePoints()
          .map((point) => (dl ? point.dataset.get(dl)?.rawValue() : undefined)),
      )
  })

  const zoneSourceTempAverages = createLazyMemo(() =>
    sourceTempMatrix().map((zoneValues) =>
      computeAverage(
        zoneValues.flatMap((v) => (typeof v === 'number' ? v : [])),
      ),
    ),
  )

  const reportSourceTempAverage = createLazyMemo(() =>
    computeAverage(
      zoneSourceTempAverages().flatMap((v) => (typeof v === 'number' ? v : [])),
    ),
  )

  const owner = getOwner()

  report.dataLabels.groups
    .list()[0]
    .choices.list()
    .filter((label) => label.name.startsWith('D'))
    .map((rawDeflectionDataLabel) => {
      const currentDeflectionDataLabel = createDataLabel({
        name: rawDeflectionDataLabel.name,
        unit: rawDeflectionDataLabel.unit,
        category: currentCategory,
      })

      report.dataLabels.pushTo('Drop', currentDeflectionDataLabel)

      return { rawDeflectionDataLabel, currentDeflectionDataLabel }
    })
    .forEach(({ rawDeflectionDataLabel, currentDeflectionDataLabel }) => {
      createEffect(
        () =>
          store.selectedProject() === report.project() &&
          batch(() =>
            report
              .sortedPoints()
              .flatMap((point) => point.drops)
              .filter((drop) => !drop.dataset.get(currentDeflectionDataLabel))
              .forEach((drop) =>
                runWithOwner(owner, () => {
                  const pointIndex = drop.point.index

                  const zone = drop.point.zone

                  const zoneIndex = createLazyMemo(() =>
                    // @ts-expect-error ts fail
                    zone().report().zones().indexOf(zone()),
                  )

                  const rawDeflection = createLazyMemo(
                    () => drop.dataset.get(rawDeflectionDataLabel)!,
                  )

                  const multiplier = createLazyMemo(() => {
                    const currentLoad = drop.dataset.get(currentLoadDataLabel)

                    const rawLoad = drop.dataset.get(rawLoadDataLabel)

                    if (!currentLoad || !rawLoad) return 1

                    return currentLoad.rawValue() / rawLoad.rawValue()
                  })

                  const sourceTemperature = createLazyMemo(() => {
                    if (temperature.source.selected() === 'Custom') {
                      return temperature.customValue.value()
                    }

                    if (temperature.average.selected() === 'Point') {
                      const matrix = sourceTempMatrix()

                      return matrix[zoneIndex()][pointIndex()]
                    }

                    if (temperature.average.selected() === 'Zone') {
                      return zoneSourceTempAverages()[zoneIndex()]
                    }

                    return reportSourceTempAverage()
                  })

                  const divider = createLazyMemo(() => {
                    const source = sourceTemperature()

                    if (!temperature.active() || !source) return 1

                    const k = temperature.structureType.selected()?.k || 0

                    const siRefTemp = temperature.reference.value()

                    return 1 + (k * (source - siRefTemp)) / siRefTemp
                  })

                  const currentDeflection = createDataValue(
                    createLazyMemo(
                      () =>
                        (rawDeflection().rawValue() * multiplier()) / divider(),
                    ),
                    currentDeflectionDataLabel,
                  )

                  drop.dataset.set(
                    currentDeflectionDataLabel,
                    currentDeflection,
                  )
                }),
              ),
          ),
      )
    })
}
