import { translate } from '/src/locales'

export const createDataLabel = <T extends string, Unit extends string>(args: {
  name: string
  shortName?: string
  unit?: MathUnit<T>
  unitKey?: Unit
  category: DataCategory
}): DataLabel<T> => {
  return {
    ...args,
    getDisplayedName: function () {
      return `${translate(this.name)}${
        this.category.neededInExcelName
          ? ` (${translate(this.category.name)})`
          : ''
      }`
    },
    getSerializedName: function () {
      return `${this.shortName || this.name}${
        this.category.neededInExcelName ? `_${this.category.name}` : ''
      }`
    },
    toJSON: function () {
      return {
        version: 1,
        name: this.name,
        unit: args.unitKey,
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

  return createDataLabel({
    name: json.name,
    unit: (units as any)[json.unit],
    unitKey: json.unit,
    category,
  })
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
