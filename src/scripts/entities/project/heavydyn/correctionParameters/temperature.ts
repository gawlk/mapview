import { createSelectableList } from '/src/scripts/utils'

import { createMathNumber } from '../../../math'

export const createHeavydynProjectTemperatureCorrectionParametersFromJSON = (
  json: JSONHeavydynTemperatureCorrectionParametersVAny,
  units: HeavydynMathUnits
) => {
  json = upgradeJSON(json)

  const temperatureCorrectionParameters: HeavydynTemperatureCorrectionParameters =
    shallowReactive({
      active: false,
      // Temperature from > Temperature to
      source: createSelectableList(
        ['Tair', 'Tsurf', 'Tman', 'Custom'] as TemperatureSourceList,
        {
          selected: json.source,
        }
      ),
      average: createSelectableList(
        ['Point', 'Zone', 'Report'] as TemperatureAverageList,
        {
          selected: json.average,
        }
      ),
      customValue: createMathNumber(json.customValue, units.temperature),
      reference: createMathNumber(json.reference, units.temperature),
      structureType: createSelectableList(
        [
          {
            name: 'Souple',
            k: 0.15,
          },
          {
            name: 'Bitumineux épais',
            k: 0.2,
          },
          {
            name: 'Mixte',
            k: 0.08,
          },
          {
            name: 'Semi-rigide',
            k: 0.04,
          },
        ] as TemperatureStructureTypeList,
        {
          selectedIndex: json.structureType,
        }
      ),
    })

  return temperatureCorrectionParameters
}

const upgradeJSON = (
  json: JSONHeavydynTemperatureCorrectionParametersVAny
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
