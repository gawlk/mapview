import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

export const createCurvatureRadiusDataComputers = (report: HeavydynReport) => {
  const unitName: HeavydynUnitsNames = 'distance'

  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  return [
    {
      side: 'Front',
      dl:
        report.dataLabels.findIn('Drop', 'D200', currentCategory) ||
        report.dataLabels.findIn('Drop', 'D300', currentCategory),
    },
    {
      side: 'Back',
      dl:
        report.dataLabels.findIn('Drop', 'D-200', currentCategory) ||
        report.dataLabels.findIn('Drop', 'D-300', currentCategory),
    },
  ].map((obj) => {
    return createDataComputer({
      label:
        obj.dl &&
        report.dataLabels.pushTo(
          'Drop',
          createDataLabel({
            name: `Curvature radius (${obj.side})`,
            unit: report.project.units[unitName],
            unitKey: unitName,
            category: indicatorsCategory,
          })
        ),
      compute: (label) => {
        report.zones.forEach((zone) =>
          zone.points.forEach((point) =>
            point.drops.forEach((drop) => {
              const d1 = drop.data.find((data) => data.label === d0DataLabel)

              const d2 = drop.data.find((data) => data.label === obj.dl)

              if (d1 && d2) {
                const data =
                  drop.data.find((data) => data.label === label) ||
                  drop.data[drop.data.push(createDataValue(0, label)) - 1]

                data.value.updateValue(
                  (0 - Number(d2.label.name.slice(1)) * 10 ** -3) ** 2 /
                    (2 * (d1.value.getValueAs('m') - d2.value.getValueAs('m')))
                )
              }
            })
          )
        )
      },
    })
  })
}
