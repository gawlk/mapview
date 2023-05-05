import {
  average,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  isCurrentCategory,
  isRawCategory,
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
                category: currentCategory,
              })
            ) - 1
          ],
        compute: (currentLabel) => {
          const correctionParameters = report.project.correctionParameters

          const sourceTempMatrix = report.zones.map((zone) =>
            zone.points.map(
              (point) =>
                point.data.find(
                  (data) =>
                    data.label.name ===
                    correctionParameters.temperature.source.selected
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

                  const currentLoad = drop.data.find(
                    (data) =>
                      data.label.name === 'Load' &&
                      isCurrentCategory(data.label.category)
                  )

                  const rawLoad = drop.data.find(
                    (data) =>
                      data.label.name === 'Load' &&
                      isRawCategory(data.label.category)
                  )

                  if (currentLoad && rawLoad) {
                    value *= currentLoad.value.value / rawLoad.value.value
                  }

                  const tempRef =
                    correctionParameters.temperature.source.selected ===
                    'Custom'
                      ? correctionParameters.temperature.customValue.value
                      : correctionParameters.temperature.average.selected ===
                        'Point'
                      ? sourceTempMatrix[zoneIndex][pointIndex]
                      : correctionParameters.temperature.average.selected ===
                        'Zone'
                      ? zoneSourceTempAverage
                      : reportSourceTempAverage

                  if (tempRef && correctionParameters.temperature.active) {
                    const k =
                      correctionParameters.temperature.structureType.selected
                        ?.k || 0

                    const tempTo =
                      correctionParameters.temperature.reference.value

                    value /= 1 + (k * (tempRef - tempTo)) / tempTo
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
