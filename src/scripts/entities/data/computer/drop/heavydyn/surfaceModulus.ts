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
  const labels = report.dataLabels.groups.list[0].choices.list

  return labels
    .filter(
      (label) =>
        label.name.startsWith('D') && label.category === currentCategory
    )
    .map((currentLabel) => {
      const smLabel = createDataLabel(
        `SM${currentLabel.name.slice(1)}`,
        currentLabel.unit,
        'deflection' as HeavydynUnitsNames,
        indicatorsCategory
      )

      labels.push(smLabel)

      return createDataComputer({
        label: smLabel,
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
                  const pression = load.value.value / (Math.PI * radius ** 2)

                  const multiplicator = isSM0 ? 2 : 1

                  const correctedDefl = isSM0
                    ? 1
                    : Number(deflection.label.name.slice(1)) *
                      deflection.value.value

                  const value =
                    multiplicator *
                    pression *
                    (1 - poisson) *
                    (radius / correctedDefl)

                  sm.value.updateValue(value)
                }
              })
            })
          )
        },
      })
    })
}
