import {
  average,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  rawCategory,
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

          const dropIndexValue = dropGroupDataLabels.indexes.selected?.value

          const sourceTempMatrix = report.zones.map((zone) =>
            zone.points.map((point) =>
              point.data
                .find(
                  (data) =>
                    data.label.name ===
                    correctionParameters.temperature.source.selected
                )
                ?.getRawValue()
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

                  let value = rawData.getRawValue()

                  const currentLoad = drop.data.find(
                    (data) =>
                      data.label.name === 'Load' &&
                      data.label.category === currentCategory
                  )

                  const rawLoad = drop.data.find(
                    (data) =>
                      data.label.name === 'Load' &&
                      data.label.category === rawCategory
                  )

                  if (currentLoad && rawLoad) {
                    value *= currentLoad.getRawValue() / rawLoad.getRawValue()
                  }

                  const sourceTemperature =
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

                  if (
                    sourceTemperature &&
                    correctionParameters.temperature.active
                  ) {
                    const k =
                      correctionParameters.temperature.structureType.selected
                        ?.k || 0

                    const siRefTemp =
                      correctionParameters.temperature.reference.value

                    value /=
                      1 + (k * (sourceTemperature - siRefTemp)) / siRefTemp
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
