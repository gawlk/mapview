import {
  createDataLabel,
  createDataValue,
  currentCategory,
  indicatorsCategory,
} from '/src/scripts'

export const createHeavydynCurrentDropDataFactories = (
  labels: DataLabel[],
  units: HeavydynMathUnits
) => {
  const factories: DataFactory[] = labels.map((label) => ({
    label: createDataLabel(
      label.name,
      label.unit,
      Object.values(units).find(
        (unit) => label.unit === unit
      )?.[0] as HeavydynUnitsNames,
      currentCategory
    ),
    createDataValueTuple: function () {
      if (this.label) {
        const dataValue = createDataValue(0, this.label)

        const update: DataValueUpdater = (dataList) => {
          const raw = dataList.find((data) => data.label === label)

          return raw && dataValue.value.updateValue(raw.value.value)
        }

        // D current =

        // D RAW

        // Si correction en Force
        // *
        // Force Ref / Force mesurée
        // Force Ref = Si Force Séquence selected (aka index) si valeur est en force (distance possible...) sinon valeur customisé

        // TODO: ne pas oublié de update toutes les force current à force ref

        // Si correnction en temperature
        // *
        // 1 - K (valeur de la structure selectionné) * (temp du point ou la moyenne des points dans la zoens ou la moyenne des points du rapport ou custom (customvalue)) / temperature_To

        return [dataValue, update]
      } else {
        return []
      }
    },
  }))

  return factories
}

export const createBLIDataFactory = (
  labels: DataLabel[],
  units: HeavydynMathUnits
) => {
  const unitName: HeavydynUnitsNames = 'deflection'

  const d0DataLabel = labels.find((label) => label.name === 'D0')

  const d300DataLabel = labels.find((label) => label.name === 'D300')

  const factory: DataFactory = {
    label:
      d0DataLabel &&
      d300DataLabel &&
      createDataLabel(
        'BLI (Lower layer index)',
        units[unitName],
        unitName,
        indicatorsCategory
      ),
    createDataValueTuple: function () {
      if (this.label) {
        const dataValue = createDataValue(0, this.label)

        const update: DataValueUpdater = (dataList) => {
          const d0 = dataList.find((data) => data.label === d0DataLabel)

          const d300 = dataList.find((data) => data.label === d300DataLabel)

          return (
            d0 &&
            d300 &&
            dataValue.value.updateValue(d0.value.value - d300.value.value)
          )
        }

        return [dataValue, update]
      } else {
        return []
      }
    },
  }

  return factory
}

export const createMLIDataFactory = (
  labels: DataLabel[],
  units: HeavydynMathUnits
): DataFactory => {
  const unitName: HeavydynUnitsNames = 'deflection'

  const d300DataLabel = labels.find((label) => label.name === 'D300')

  const d600DataLabel = labels.find((label) => label.name === 'D600')

  return {
    label:
      d300DataLabel &&
      d600DataLabel &&
      createDataLabel(
        'MLI (Lower layer index)',
        units[unitName],
        unitName,
        indicatorsCategory
      ),
    createDataValueTuple: function () {
      if (this.label) {
        const dataValue = createDataValue(0, this.label)

        const update: DataValueUpdater = (dataList) => {
          const d300 = dataList.find((data) => data.label === d300DataLabel)

          const d600 = dataList.find((data) => data.label === d600DataLabel)

          return (
            d300 &&
            d600 &&
            dataValue.value.updateValue(d300.value.value - d600.value.value)
          )
        }

        return [dataValue, update]
      } else {
        return []
      }
    },
  }
}

export const createLLIDataFactory = (
  labels: DataLabel[],
  units: HeavydynMathUnits
): DataFactory => {
  const unitName: HeavydynUnitsNames = 'deflection'

  const d600DataLabel = labels.find((label) => label.name === 'D600')

  const d900DataLabel = labels.find((label) => label.name === 'D900')

  return {
    label:
      d600DataLabel &&
      d900DataLabel &&
      createDataLabel(
        'LLI (Lower layer index)',
        units[unitName],
        unitName,
        indicatorsCategory
      ),
    createDataValueTuple: function () {
      if (this.label) {
        const dataValue = createDataValue(0, this.label)

        const update: DataValueUpdater = (dataList) => {
          const d600 = dataList.find((data) => data.label === d600DataLabel)

          const d900 = dataList.find((data) => data.label === d900DataLabel)

          return (
            d600 &&
            d900 &&
            dataValue.value.updateValue(d600.value.value - d900.value.value)
          )
        }

        return [dataValue, update]
      } else {
        return []
      }
    },
  }
}

export const createHeavydynSurfaceModulusDataFactories = (
  labels: DataLabel[],
  units: HeavydynMathUnits
) => {
  const factories: DataFactory[] = labels
    .filter((label) => label.name.startsWith('D'))
    .map((label) => ({
      label: createDataLabel(
        label.name,
        label.unit,
        Object.values(units).find(
          (unit) => label.unit === unit
        )?.[0] as HeavydynUnitsNames,
        {
          name: 'Surface modulus',
          neededInExcelName: true,
        }
      ),
      createDataValueTuple: function () {
        if (this.label) {
          const dataValue = createDataValue(0, this.label)

          const update: DataValueUpdater = (dataList) => {
            const raw = dataList.find((data) => data.label === label)

            return raw && dataValue.value.updateValue(raw.value.value)
          }

          // TODO:
          // rayon = dPlate du projet / 2
          // d0 = d0 current
          // coeff poisson = 0.35 (visible et modifiable)
          //

          // 2 * (Force current = (pi * r**2)) * (1 - poisson ** 2) * rayon / d0current

          return [dataValue, update]
        } else {
          return []
        }
      },
    }))

  return factories
}

export const createCurvatureRadiusDataFactory = (
  labels: DataLabel[],
  units: HeavydynMathUnits
): DataFactory => {
  const unitName: HeavydynUnitsNames = 'deflection'

  return {
    label: createDataLabel(
      'Curvature radius',
      units[unitName],
      unitName,
      indicatorsCategory
    ),
    createDataValueTuple: function () {
      if (this.label) {
        const dataValue = createDataValue(0, this.label)

        const update = () => dataValue.value.updateValue(0)

        // Dep: d0current (d200current OU d300current)

        // Forward
        // Ravant
        // si pas d200 alors d300
        // Par rapport au pdf
        // R0 = 0
        // R200 = 0.2m
        // d0 = d0current
        // d200 = d200current

        // Backward
        // Same check PDF
        return [dataValue, update]
      } else {
        return []
      }
    },
  }
}

export const createCumSumDataFactory = (
  labels: DataLabel[],
  units: HeavydynMathUnits
): DataFactory => {
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
