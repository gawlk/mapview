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

  return (
    labels
      .filter((label) => label.name.startsWith('D'))
      // eslint-disable-next-line sonarjs/cognitive-complexity
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
                        data.label.category === currentCategory
                    )

                    const rawLoad = drop.data.find(
                      (data) =>
                        data.label.name === 'Load' &&
                        data.label.category === rawCategory
                    )

                    if (currentLoad && rawLoad) {
                      value *= currentLoad.value.value / rawLoad.value.value
                    }

                    const { temperature } = correctionParameters

                    let sourceTemperature: number | undefined =
                      reportSourceTempAverage

                    if (temperature.source.selected === 'Custom') {
                      sourceTemperature = temperature.customValue.value
                    } else if (temperature.average.selected === 'Point') {
                      sourceTemperature =
                        sourceTempMatrix[zoneIndex][pointIndex]
                    } else if (temperature.average.selected === 'Zone') {
                      sourceTemperature = zoneSourceTempAverage
                    }

                    if (sourceTemperature && temperature.active) {
                      const k = temperature.structureType.selected?.k || 0

                      const siRefTemp = temperature.reference.value

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
  )
}
