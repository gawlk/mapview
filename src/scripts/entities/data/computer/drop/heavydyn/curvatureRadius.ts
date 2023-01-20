import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

// TODO: Same for back
export const createCurvatureRadiusDataComputers = (report: HeavydynReport) => {
  const labels = report.dataLabels.groups.list[0].choices.list

  const unitName: HeavydynUnitsNames = 'deflection'

  const d0DataLabel = labels.find(
    (label) => label.name === 'D0' && label.category === currentCategory
  )

  const d200DataLabel = labels.find(
    (label) => label.name === 'D200' && label.category === currentCategory
  )

  const d300DataLabel = labels.find(
    (label) => label.name === 'D300' && label.category === currentCategory
  )

  const label =
    d0DataLabel &&
    (d200DataLabel || d300DataLabel) &&
    createDataLabel(
      'Curvature radius (Front)',
      report.project.units[unitName],
      unitName,
      indicatorsCategory
    )

  label && labels.push(label)

  return createDataComputer({
    label,
    compute: (label) => {
      report.zones.forEach((zone) =>
        zone.points.forEach((point) =>
          point.drops.forEach((drop) => {
            const d1 = drop.data.find((data) => data.label === d0DataLabel)

            const d2 = drop.data.find(
              (data) =>
                data.label === d200DataLabel || data.label === d300DataLabel
            )

            if (d1 && d2) {
              const data =
                drop.data.find((data) => data.label === label) ||
                drop.data[drop.data.push(createDataValue(0, label)) - 1]

              data.value.updateValue(
                (0 - Number(d2.label.name.slice(0))) ** 2 /
                  (2 * (d1.value.value - d2.value.value))
              )
            }
          })
        )
      )
    },
  })
}
