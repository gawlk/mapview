export const createDataLabelFromJSON = <T extends string>(
  json: JSONDataLabelVAny<T>,
  units: MachineMathUnits
): DataLabel<T> => {
  json = upgradeJSON(json)

  return {
    name: json.name,
    unit: (units as any)[json.unit],
    toJSON: function () {
      return {
        version: 1,
        name: this.name,
        unit: json.unit,
      }
    },
  }
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
