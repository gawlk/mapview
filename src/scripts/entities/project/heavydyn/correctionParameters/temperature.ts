import { createMathNumber, createSelectableList } from '/src/scripts'

export const createHeavydynProjectTemperatureCorrectionParametersFromJSON = (
  json: JSONHeavydynTemperatureCorrectionParametersVAny,
  units: HeavydynMathUnits,
) => {
  json = upgradeJSON(json)

  const temperatureCorrectionParameters: HeavydynTemperatureCorrectionParameters =
    createMutable({
      active: json.active,
      source: createSelectableList(
        ['Tair', 'Tsurf', 'Tman', 'Custom'] as TemperatureSourceList,
        {
          selected: json.source,
        },
      ),
      average: createSelectableList(
        ['Point', 'Zone', 'Report'] as TemperatureAverageList,
        {
          selected: json.average,
        },
      ),
      customValue: createMathNumber(json.customValue, units.temperature),
      reference: createMathNumber(json.reference, units.temperature),
      structureType: createSelectableList(
        [
          {
            name: 'Flexible',
            k: 0.15,
          },
          {
            name: 'Thick flexible',
            k: 0.2,
          },
          {
            name: 'Mixed',
            k: 0.08,
          },
          {
            name: 'Semi-flexible',
            k: 0.04,
          },
        ] as TemperatureStructureTypeList,
        {
          selectedIndex: json.structureType,
        },
      ),
    })

  return temperatureCorrectionParameters
}

const upgradeJSON = (
  json: JSONHeavydynTemperatureCorrectionParametersVAny,
): JSONHeavydynTemperatureCorrectionParameters => {
  switch (json.version) {
    case 1:
      json = {
        ...json,
        version: 2,
        reference: json.temperatureTo,
        source: json.temperatureFromSource,
      }
  }

  return json
}
