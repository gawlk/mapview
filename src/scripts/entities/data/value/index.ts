import { createMathNumber } from '/src/scripts'

export const createDataValueFromJSON = (
  json: JSONDataValueVAny,
  list: DataLabel<string>[]
): DataValue<string> => {
  json = upgradeJSON(json)

  const label = list.find(
    (dataLabel) => dataLabel.name === json.label
  ) as DataLabel<string>

  return {
    category: json.category,
    label,
    value: createMathNumber(json.value, label.unit),
    toJSON: function () {
      return {
        version: json.version,
        category: this.category,
        label: this.label.name,
        value: this.value.value,
      }
    },
  }
}

const upgradeJSON = (json: JSONDataValueVAny): JSONDataValue => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONDataValue
  }

  return json
}
