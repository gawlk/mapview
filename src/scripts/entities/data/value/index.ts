import { createMathNumber } from '/src/scripts'

export const createDataValue = (
  value: number,
  label: DataLabel<string>
): DataValue<string> => {
  return {
    label,
    value: createMathNumber(value, label.unit),
    getRawValue() {
      return this.value.value
    },
    toJSON() {
      return {
        version: 1,
        label: this.label.name,
        value: this.getRawValue(),
      }
    },
    toExcel() {
      return this.value.toExcel(true)
    },
  }
}

export const createDataValueFromJSON = (
  json: JSONDataValueVAny,
  list: DataLabel<string>[]
): DataValue<string> => {
  json = upgradeJSON(json)

  const label = list.find(
    (dataLabel) => dataLabel.name === json.label
  ) as DataLabel<string>

  return createDataValue(json.value, label)
}

const upgradeJSON = (json: JSONDataValueVAny): JSONDataValue => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
