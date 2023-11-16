import { createMathNumber } from '/src/scripts'

export const createDataValue = (
  _value: Accessor<number>,
  label: DataLabel<string>,
) => {
  const value = createMathNumber(_value, label.unit)

  const dataValue: DataValue<string> = {
    label,
    value,
    rawValue: value.value,
    toJSON() {
      return {
        version: 1,
        label: this.label.name,
        value: this.rawValue(),
      }
    },
    toExcel() {
      return this.value.toExcel(true)
    },
  }

  return dataValue
}

export const createDataValueFromJSON = (
  json: JSONDataValueVAny,
  list: DataLabel<string>[],
): DataValue<string> => {
  json = upgradeJSON(json)

  const label = list.find(
    (dataLabel) => dataLabel.name === json.label,
  ) as DataLabel<string>

  return createDataValue(() => json.value, label)
}

const upgradeJSON = (json: JSONDataValueVAny): JSONDataValue => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
