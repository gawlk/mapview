export const createDataLabelFromJSON = <T extends String>(
  json: JSONDataLabelVAny<T>,
  units: MachineMathUnits
): DataLabel<T> => {
  json = upgradeJSON(json)

  return {
    name: json.name,
    unit:
      json.unit in units
        ? // @ts-ignore next-line
          units[json.unit]
        : json.unit,
    // calculate: () => {}
  }
}

const upgradeJSON = <T extends String>(
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
