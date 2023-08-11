import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  rawCategory,
} from '/src/scripts'

export const createHeavydynCurrentLoadDataComputer = (
  report: HeavydynReport,
) => {
  const rawLoadDataLabel = report.dataLabels.findIn('Drop', 'Load', rawCategory)

  // Can be changed
  const indexDataValue =
    report.dataLabels.groups.list[0].indexes.list.at(-1)?.value

  return createDataComputer({
    label:
      rawLoadDataLabel &&
      report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: rawLoadDataLabel.name,
          unit: rawLoadDataLabel.unit,
          category: currentCategory,
        }),
      ),
    compute: (currentLoadDataLabel) => {
      const {
        project: { correctionParameters },
      } = report

      const correctedLoad =
        correctionParameters.load.source.selected === 'Sequence' &&
        indexDataValue &&
        indexDataValue.unit === rawLoadDataLabel?.unit
          ? indexDataValue
          : correctionParameters.load.customValue

      report.zones.forEach((zone) =>
        zone.points.forEach((point) =>
          point.drops.forEach((drop) => {
            let referenceData: MathNumber
            if (!correctionParameters.load.active) {
              referenceData = (
                drop.data.find(
                  (_data) => _data.label === rawLoadDataLabel,
                ) as DataValue<string>
              ).value // can't be undefined
            } else {
              referenceData = correctedLoad
            }

            const data =
              drop.data.find((_data) => _data.label === currentLoadDataLabel) ||
              drop.data[
                drop.data.push(createDataValue(0, currentLoadDataLabel)) - 1
              ]

            data.value.updateValue(referenceData.value)
          }),
        ),
      )
    },
  })
}
