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

  return report.dataLabels
    .getList('Drop')
    .filter(
      (label) =>
        label.name.startsWith('D') && label.category === currentCategory
    )
    .map((currentLabel) => {
      return createDataComputer({
        label: report.dataLabels.pushTo(
          'Drop',
          createDataLabel({
            name: `SM${currentLabel.name.slice(1)}`,
            unit: report.project.units[unitName],
            unitKey: unitName,
            category: indicatorsCategory,
          })
        ),
        compute: (label) => {
          const isSM0 = label.name === 'SM0'

          const radius = report.project.calibrations.dPlate / 2

          const poisson = 0.35

          report.zones.forEach((zone) =>
            zone.points.forEach((point) => {
              point.drops.forEach((drop) => {
                const load = drop.data.find(
                  (data) => data.label.name === 'Load'
                )

                // DX === SMX - We remove D and SM to check the equality of labels as only the label passed on the compute function can be used
                const deflection = drop.data.find(
                  (data) => data.label.name.slice(1) === label.name.slice(2)
                )

                const sm =
                  drop.data.find((data) => data.label === label) ||
                  drop.data[drop.data.push(createDataValue(0, label)) - 1]

                if (load && deflection) {
                  const pressure = load.value.value / (Math.PI * radius ** 2)

                  const multiplier = isSM0 ? 2 : 1

                  const correctedDeflection = isSM0
                    ? 1
                    : Number(deflection.label.name.slice(1)) *
                      deflection.value.value

                  const value =
                    multiplier *
                    pressure *
                    (1 - poisson) *
                    (radius / correctedDeflection)

                  sm.value.updateValue(value)
                }
              })
            })
          )
        },
      })
    })
}
