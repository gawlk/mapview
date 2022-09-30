export const createDataLabelFromJSON = <T extends String>(
  json: JSONDataLabel<T>,
  units: MachineMathUnits
): DataLabel<T> => {
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
