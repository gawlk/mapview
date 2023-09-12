import {
  createDataComputer,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
  run,
} from '/src/scripts'

const layerIndexCompute =
  (report: HeavydynReport, dataLabel1?: DataLabel, dataLabel2?: DataLabel) =>
  (label: DataLabel) => {
    if (!dataLabel1 || !dataLabel2) return

    report.zones.forEach((zone) =>
      zone.points.forEach((point) =>
        point.drops.forEach((drop) => {
          const data =
            drop.dataset.get(label.toString()) ||
            run(() => {
              const dl = createDataValue(0, label)
              drop.dataset.set(label.toString(), dl)
              return dl
            })

          const d1 = drop.dataset.get(dataLabel1?.toString())

          const d2 = drop.dataset.get(dataLabel2?.toString())

          if (d1 && d2) {
            data.value.updateValue(d1.getRawValue() - d2.getRawValue())
          }
        }),
      ),
    )
  }

export const createBLIDataComputer = (report: HeavydynReport) => {
  const d0DataLabel = report.dataLabels.findIn('Drop', 'D0', currentCategory)

  const d300DataLabel = report.dataLabels.findIn(
    'Drop',
    'D300',
    currentCategory,
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
          category: indicatorsCategory,
        }),
      ),
    compute: layerIndexCompute(report, d0DataLabel, d300DataLabel),
  })
}

export const createMLIDataComputer = (report: HeavydynReport) => {
  const d300DataLabel = report.dataLabels.findIn(
    'Drop',
    'D300',
    currentCategory,
  )

  const d600DataLabel = report.dataLabels.findIn(
    'Drop',
    'D600',
    currentCategory,
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
          category: indicatorsCategory,
        }),
      ),
    compute: layerIndexCompute(report, d300DataLabel, d600DataLabel),
  })
}

export const createLLIDataComputer = (report: HeavydynReport) => {
  const d600DataLabel = report.dataLabels.findIn(
    'Drop',
    'D600',
    currentCategory,
  )

  const d900DataLabel = report.dataLabels.findIn(
    'Drop',
    'D900',
    currentCategory,
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
          category: indicatorsCategory,
        }),
      ),
    compute: layerIndexCompute(report, d600DataLabel, d900DataLabel),
  })
}
