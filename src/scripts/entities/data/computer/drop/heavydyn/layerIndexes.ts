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
  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  const d300DataLabel = report.dataLabels.findIn(
    'Drop',
    'D300',
    currentCategory
  )

  return createDataComputer({
    label:
      d0DataLabel &&
      d300DataLabel &&
      report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: 'BLI (Base layer index)',
          shortName: 'BLI',
          unit: d0DataLabel.unit,
          unitKey: 'deflection' as HeavydynUnitsNames,
          category: indicatorsCategory,
        })
      ),
    compute: layerIndexCompute(report, d0DataLabel, d300DataLabel),
  })
}

export const createMLIDataComputer = (report: HeavydynReport) => {
  const d300DataLabel = report.dataLabels.findIn(
    'Drop',
    'D300',
    currentCategory
  )

  const d600DataLabel = report.dataLabels.findIn(
    'Drop',
    'D600',
    currentCategory
  )

  return createDataComputer({
    label:
      d300DataLabel &&
      d600DataLabel &&
      report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: 'MLI (Middle layer index)',
          shortName: 'MLI',
          unit: d300DataLabel.unit,
          unitKey: 'deflection' as HeavydynUnitsNames,
          category: indicatorsCategory,
        })
      ),
    compute: layerIndexCompute(report, d300DataLabel, d600DataLabel),
  })
}

export const createLLIDataComputer = (report: HeavydynReport) => {
  const d600DataLabel = report.dataLabels.findIn(
    'Drop',
    'D600',
    currentCategory
  )

  const d900DataLabel = report.dataLabels.findIn(
    'Drop',
    'D900',
    currentCategory
  )

  return createDataComputer({
    label:
      d600DataLabel &&
      d900DataLabel &&
      report.dataLabels.pushTo(
        'Drop',
        createDataLabel({
          name: 'LLI (Lower layer index)',
          shortName: 'LLI',
          unit: d600DataLabel.unit,
          unitKey: 'deflection' as HeavydynUnitsNames,
          category: indicatorsCategory,
        })
      ),
    compute: layerIndexCompute(report, d600DataLabel, d900DataLabel),
  })
}
