import { translate } from '/src/locales'

import { rawCategory } from '../category'

export const createDataLabel = <T extends string, Unit extends string>(args: {
  name: string
  shortName?: string
  unit: MathUnit<T>
  unitKey?: Unit
  category: DataCategory
}): DataLabel<T> => {
  return {
    ...args,
    getDisplayedName() {
      return `${translate(this.name)}${
        this.category.neededInExcelName
          ? ` (${translate(this.category.name)})`
          : ''
      }`
    },
    getSerializedName() {
      return `${this.shortName || this.name}${
        this.category.neededInExcelName ? `_${this.category.name}` : ''
      }`
    },
    getTSVName(t) {
      const name = this.shortName || this.name
      const categoryName = this.category.name

      return `${t(name, undefined, name)}${
        categoryName === rawCategory.name
          ? `${t(categoryName, undefined, categoryName).toLowerCase()}`
          : ''
      }`
    },
    toString() {
      return generateDataLabelString(this.category, this.name)
    },
    toJSON() {
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
  MathUnits extends MachineMathUnits,
>(
  json: JSONDataLabelVAny<T>,
  units: MathUnits,
  category: DataCategory,
): DataLabel<T> => {
  json = upgradeJSON(json)

  return createDataLabel({
    name: json.name,
    unit: (units as AnyUnit)[json.unit],
    unitKey: json.unit,
    category,
  })
}

const upgradeJSON = <T extends string>(
  json: JSONDataLabelVAny<T>,
): JSONDataLabel<T> => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

export const generateDataLabelString = (category: DataCategory, name: string) =>
  `${category.name}_${name}`
