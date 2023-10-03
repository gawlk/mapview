import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

export const createCurvatureRadiusDataComputers = (report: HeavydynReport) => {
  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  return [
    {
      side: 'Front',
      dataLabel:
        report.dataLabels.findIn('Drop', 'D200', currentCategory) ||
        report.dataLabels.findIn('Drop', 'D300', currentCategory),
    },
    {
      side: 'Back',
      dataLabel:
        report.dataLabels.findIn('Drop', 'D-200', currentCategory) ||
        report.dataLabels.findIn('Drop', 'D-300', currentCategory),
    },
  ].map((params) => {
    return createDataComputer({
      label:
        d0DataLabel &&
        params.dataLabel &&
        report.dataLabels.pushTo(
          'Drop',
          createDataLabel({
            name: `Curvature radius (${params.side})`,
            shortName: `Cr${params.side.toLowerCase()}`,
            unit: report.project.units.radius,
            category: indicatorsCategory,
          }),
        ),
      compute: (label) => {
        report.zones.forEach((zone) =>
          zone.points.forEach((point) =>
            point.drops.forEach((drop) => {
              const d1 = drop.data.find((_data) => _data.label === d0DataLabel)

              const d2 = drop.data.find(
                (_data) => _data.label === params.dataLabel,
              )

              if (d1 && d2) {
                const data =
                  drop.data.find((_data) => _data.label === label) ||
                  drop.data[drop.data.push(createDataValue(0, label)) - 1]

                data.value.updateValue(
                  (0 - Number(d2.label.name.slice(1)) * 10 ** -3) ** 2 /
                    (2 * (d1.value.getValueAs('m') - d2.value.getValueAs('m'))),
                )
              }
            }),
          ),
        )
      },
    })
  })
}
