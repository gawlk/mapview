import {
  average,
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

export const createCharacteristicDeflectionFactory = (
  dropDataLabels: DataLabel[],
  units: HeavydynMathUnits
): DataFactory => {
  const unitName: HeavydynUnitsNames = 'deflection'

  const d0DataLabel = dropDataLabels.find(
    (label) => label.name === 'D0' && label.category === currentCategory
  )

  return {
    label:
      d0DataLabel &&
      createDataLabel(
        'Characteristic deflection',
        units[unitName],
        unitName,
        indicatorsCategory
      ),
    createDataValueTuple: function () {
      if (this.label) {
        const dataValue = createDataValue(0, this.label)

        const update: DataValueUpdater = (dataList) => {
          const d0s = dataList.filter((data) => data.label === d0DataLabel)

          const d0sMean = average(d0s.map((d0) => d0.value.value))

          const standardDeviation =
            d0s
              .map((d0) => Math.abs(d0sMean - d0.value.value))
              .reduce((total, value) => total + value, 0) / d0s.length

          return dataValue.value.updateValue(d0sMean + 2 * standardDeviation)
        }

        return [dataValue, update]
      } else {
        return []
      }
    },
  }
}
