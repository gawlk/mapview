import {
  average,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
} from '/src/scripts'

export const createHeavydynCurrentDeflectionDropDataComputers = (
  report: HeavydynReport
) => {
  const dropGroupDataLabels = report.dataLabels.groups.list[0]
  const labels = dropGroupDataLabels.choices.list

  return labels
    .filter((label) => label.name.startsWith('D'))
    .map((rawLabel) => {
      return createDataComputer({
        label:
          labels[
            labels.push(
              createDataLabel({
                name: rawLabel.name,
                unit: rawLabel.unit,
                unitKey: 'deflection' as HeavydynUnitsNames,
                category: currentCategory,
              })
            ) - 1
          ],
        compute: (currentLabel) => {
          const correctionParameters = report.project.correctionParameters

          const dropIndexValue = dropGroupDataLabels.indexes.selected?.value

          const sourceTempMatrix = report.zones.map((zone) =>
            zone.points.map(
              (point) =>
                point.data.find(
                  (data) =>
                    data.label.name ===
                    correctionParameters.temperature.temperatureFromSource
                      .selected
                )?.value.value
            )
          )

          const reportSourceTempAverage = average(
            sourceTempMatrix.flat().filter((v) => v) as number[]
          )

          report.zones.forEach((zone, zoneIndex) => {
            const zoneSourceTempAverage = average(
              sourceTempMatrix[zoneIndex].filter((v) => v) as number[]
            )

            zone.points.forEach((point, pointIndex) => {
              point.drops.forEach((drop) => {
                const rawData = drop.data.find(
                  (data) => data.label === rawLabel
                )

                if (rawData) {
                  const currentData =
                    drop.data.find((data) => data.label === currentLabel) ||
                    drop.data[
                      drop.data.push(createDataValue(0, currentLabel)) - 1
                    ]

                  let value = rawData.value.value

                  const loadData = drop.data.find(
                    (data) => data.label.name === 'Load'
                  )

                  if (loadData && correctionParameters.load.active) {
                    const loadRef =
                      correctionParameters.load.loadReferenceSource.selected ===
                        'Sequence' &&
                      dropIndexValue &&
                      dropIndexValue.unit === loadData.label.unit
                        ? dropIndexValue.value
                        : correctionParameters.load.customValue.value

                    value *= loadRef / loadData.value.value
                  }

                  const tempData =
                    correctionParameters.temperature.average.selected ===
                    'Custom'
                      ? correctionParameters.temperature.customValue.value
                      : correctionParameters.temperature.average.selected ===
                        'Point'
                      ? sourceTempMatrix[zoneIndex][pointIndex]
                      : correctionParameters.temperature.average.selected ===
                        'Zone'
                      ? zoneSourceTempAverage
                      : reportSourceTempAverage

                  if (tempData && correctionParameters.temperature.active) {
                    const k =
                      correctionParameters.temperature.structureType.selected
                        ?.k || 0

                    const tempTo =
                      correctionParameters.temperature.temperatureTo.value

                    value *= 1 - (k * tempData) / tempTo
                  }

                  currentData.value.updateValue(value)
                }
              })
            })
          })
        },
      })
    })
}
