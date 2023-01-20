import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

const layerIndexCompute =
  (report: HeavydynReport, dataLabel1?: DataLabel, dataLabel2?: DataLabel) =>
  (label: DataLabel) => {
    report.zones.forEach((zone) =>
      zone.points.forEach((point) =>
        point.drops.forEach((drop) => {
          const data =
            drop.data.find((data) => data.label === label) ||
            drop.data[drop.data.push(createDataValue(0, label)) - 1]

          const d1 = drop.data.find((data) => data.label === dataLabel1)

          const d2 = drop.data.find((data) => data.label === dataLabel2)

          if (d1 && d2) {
            data.value.updateValue(d1.value.value - d2.value.value)
          }
        })
      )
    )
  }

export const createBLIDataComputer = (report: HeavydynReport) => {
  const labels = report.dataLabels.groups.list[0].choices.list

  const d0DataLabel = labels.find(
    (label) => label.name === 'D0' && label.category === currentCategory
  )

  const d300DataLabel = labels.find(
    (label) => label.name === 'D300' && label.category === currentCategory
  )

  const label =
    d0DataLabel &&
    d300DataLabel &&
    createDataLabel(
      'BLI (Base layer index)',
      d0DataLabel.unit,
      'deflection' as HeavydynUnitsNames,
      indicatorsCategory
    )

  label && labels.push(label)

  return createDataComputer({
    label,
    compute: layerIndexCompute(report, d0DataLabel, d300DataLabel),
  })
}

export const createMLIDataComputer = (report: HeavydynReport) => {
  const labels = report.dataLabels.groups.list[0].choices.list

  const d300DataLabel = labels.find(
    (label) => label.name === 'D300' && label.category === currentCategory
  )

  const d600DataLabel = labels.find(
    (label) => label.name === 'D600' && label.category === currentCategory
  )

  const label =
    d300DataLabel &&
    d600DataLabel &&
    createDataLabel(
      'MLI (Middle layer index)',
      d300DataLabel.unit,
      'deflection' as HeavydynUnitsNames,
      indicatorsCategory
    )

  label && labels.push(label)

  return createDataComputer({
    label,
    compute: layerIndexCompute(report, d300DataLabel, d600DataLabel),
  })
}

export const createLLIDataComputer = (report: HeavydynReport) => {
  const labels = report.dataLabels.groups.list[0].choices.list

  const d600DataLabel = labels.find(
    (label) => label.name === 'D600' && label.category === currentCategory
  )

  const d900DataLabel = labels.find(
    (label) => label.name === 'D900' && label.category === currentCategory
  )

  const label =
    d600DataLabel &&
    d900DataLabel &&
    createDataLabel(
      'LLI (Lower layer index)',
      d600DataLabel.unit,
      'deflection' as HeavydynUnitsNames,
      indicatorsCategory
    )

  label && labels.push(label)

  return createDataComputer({
    label,
    compute: layerIndexCompute(report, d600DataLabel, d900DataLabel),
  })
}
