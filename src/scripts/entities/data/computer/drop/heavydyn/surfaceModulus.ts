import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

export const createHeavydynSurfaceModulusDataComputers = (
  report: HeavydynReport
) => {
  const unitName: HeavydynUnitsNames = 'modulus'

  const currentD0DataLabel = report.dataLabels.findIn(
    'Drop',
    'DO',
    currentCategory
  )
  const currentLoadDataLabel = report.dataLabels.findIn(
    'Drop',
    'Load',
    currentCategory
  )

  return (
    currentD0DataLabel &&
    currentLoadDataLabel &&
    createDataComputer({
      label: report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: `SM0`,
          unit: report.project.units[unitName],
          unitKey: unitName,
          category: indicatorsCategory,
        })
      ),
      compute: (label) => {
        const radius = report.project.calibrations.dPlate / 2

        const poisson = 0.35

        report.zones.forEach((zone) =>
          zone.points.forEach((point) => {
            point.drops.forEach((drop) => {
              const load = drop.data.find(
                (data) => data.label === currentLoadDataLabel
              )

              const sm0 =
                drop.data.find((data) => data.label === label) ||
                drop.data[drop.data.push(createDataValue(0, label)) - 1]

              if (load) {
                const pressure = load.value.value / (Math.PI * radius ** 2)

                const value = 2 * pressure * (1 - poisson) * radius

                sm0.value.updateValue(value)
              }
            })
          })
        )
      },
    })
  )
}
