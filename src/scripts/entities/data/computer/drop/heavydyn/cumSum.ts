/*
export const createCumSumDataCompute = (
  labels: DataLabel[],
  units: HeavydynMathUnits
): DataCompute => {
  const unitName: HeavydynUnitsNames = 'deflection'

  return {
    label: createDataLabel(
      'Cumulative Sum',
      units[unitName],
      unitName,
      indicatorsCategory
    ),
    createDataValueTuple: function () {
      if (this.label) {
        const dataValue = createDataValue(0, this.label)

        const update = () => dataValue.value.updateValue(0)

        // Cumsum ZH = cumsum
        // check excel pour la formule

        return [dataValue, update]
      } else {
        return []
      }
    },
  }
}
*/
