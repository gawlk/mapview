import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
  run,
} from '/src/scripts'

export const createHeavydynSurfaceModulusDataComputers = (
  report: HeavydynReport,
) => {
  const unitName: HeavydynUnitsNames = 'modulus'

  const currentD0DataLabel = report.dataLabels.findIn(
    'Drop',
    'DO',
    currentCategory,
  )
  const currentLoadDataLabel = report.dataLabels.findIn(
    'Drop',
    'Load',
    currentCategory,
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
        }),
      ),
      compute: (label) => {
        const radius = report.project.calibrations.dPlate / 2

        const poisson = 0.35

        report.zones.forEach((zone) =>
          zone.points.forEach((point) => {
            point.drops.forEach((drop) => {
              const load = drop.dataset.get(currentLoadDataLabel.toString())

              const sm0 =
                drop.dataset.get(label.toString()) ||
                run(() => {
                  const dl = createDataValue(0, label)
                  drop.dataset.set(label.toString(), dl)
                  return dl
                })

              if (load) {
                const pressure = load.getRawValue() / (Math.PI * radius ** 2)

                const value = 2 * pressure * (1 - poisson) * radius

                sm0.value.updateValue(value)
              }
            })
          }),
        )
      },
    })
  )
}
