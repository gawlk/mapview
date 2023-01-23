import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
} from '/src/scripts'

export const createHeavydynCurrentLoadDataComputer = (
  report: HeavydynReport
) => {
  const loadDataLabel = report.dataLabels.findIn('Drop', 'Load')

  // Can be changed
  const indexDataValue =
    report.dataLabels.groups.list[0].indexes.list.at(-1)?.value

  const load =
    indexDataValue?.unit === report.project.units.force
      ? indexDataValue.value
      : report.project.correctionParameters.load.customValue.value

  return createDataComputer({
    label:
      loadDataLabel &&
      report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: loadDataLabel.name,
          unit: loadDataLabel.unit,
          unitKey: 'load' as HeavydynUnitsNames,
          category: currentCategory,
        })
      ),
    compute: (label) => {
      report.zones.forEach((zone) =>
        zone.points.forEach((point) =>
          point.drops.forEach((drop) => {
            const data =
              drop.data.find((data) => data.label === label) ||
              drop.data[drop.data.push(createDataValue(0, label)) - 1]

            data.value.updateValue(load)
          })
        )
      )
    },
  })
}
