import { translate } from '/src/locales'

export const createDataLabel = <T extends string, Unit extends string>(
  name: string,
  unit: MathUnit<T>,
  unitKey: Unit,
  category: DataCategory
): DataLabel<T> => {
  return {
    name,
    category,
    unit,
    getFullName: function () {
      return `${translate(this.name)}${
        this.category.neededInExcelName
          ? ` (${translate(this.category.name)})`
          : ''
      }`
    },
    toJSON: function () {
      return {
        version: 1,
        name: this.name,
        unit: unitKey,
      }
    },
  }
}

export const createDataLabelFromJSON = <
  T extends string,
  MathUnits extends MachineMathUnits
>(
  json: JSONDataLabelVAny<T>,
  units: MathUnits,
  category: DataCategory
): DataLabel<T> => {
  json = upgradeJSON(json)

  return createDataLabel(
    json.name,
    (units as any)[json.unit],
    json.unit,
    category
  )
}

const upgradeJSON = <T extends string>(
  json: JSONDataLabelVAny<T>
): JSONDataLabel<T> => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONDataLabel<T>
  }

  return json
}
