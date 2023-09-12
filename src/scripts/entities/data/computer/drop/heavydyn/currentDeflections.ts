import {
  computeAverage,
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  generateDataLabelString,
  rawCategory,
  run,
} from '/src/scripts'

export const createHeavydynCurrentDeflectionDropDataComputers = (
  report: HeavydynReport,
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
                }),
              ) - 1
            ],
          compute: (currentLabel) => {
            const correctionParameters = report.project.correctionParameters

            const sourceTempMatrix = report.zones.map((zone) =>
              zone
                .getExportablePoints()
                .map(
                  (point) =>
                    point.dataset
                      .get(
                        generateDataLabelString(
                          rawCategory,
                          correctionParameters.temperature.source.selected ||
                            '',
                        ),
                      )
                      ?.getRawValue(),
                ),
            )

            const reportSourceTempAverage = computeAverage(
              sourceTempMatrix.flat().filter((v) => v) as number[],
            )

            report.zones.forEach((zone, zoneIndex) => {
              const zoneSourceTempAverage = computeAverage(
                sourceTempMatrix[zoneIndex].filter((v) => v) as number[],
              )

              zone.getExportablePoints().forEach((point, pointIndex) => {
                point.drops.forEach((drop) => {
                  const rawData = drop.dataset.get(rawLabel.toString())

                  if (rawData) {
                    const currentData =
                      drop.dataset.get(currentLabel.toString()) ||
                      run(() => {
                        const dl = createDataValue(0, currentLabel)
                        drop.dataset.set(currentLabel.toString(), dl)
                        return dl
                      })

                    let value = rawData.getRawValue()

                    const currentLoad = drop.dataset.get(
                      generateDataLabelString(currentCategory, 'Load'),
                    )

                    const rawLoad = drop.dataset.get(
                      generateDataLabelString(rawCategory, 'Load'),
                    )

                    if (currentLoad && rawLoad) {
                      value *= currentLoad.getRawValue() / rawLoad.getRawValue()
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
