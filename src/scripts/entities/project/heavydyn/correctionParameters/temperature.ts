import { createASS, createSL, createWritableMathNumber } from '/src/scripts'

export const createHeavydynProjectTemperatureCorrectionParametersFromJSON = (
  json: JSONHeavydynTemperatureCorrectionParametersVAny,
  units: HeavydynMathUnits,
) => {
  json = upgradeJSON(json)

  const temperatureCorrectionParameters: HeavydynTemperatureCorrectionParameters =
    {
      active: createASS(json.active),
      source: createSL(
        ['Tair', 'Tsurf', 'Tman', 'Custom'] as TemperatureSourceList,
        {
          selected: json.source,
        },
      ),
      average: createSL(['Point', 'Zone', 'Report'] as TemperatureAverageList, {
        selected: json.average,
      }),
      customValue: createWritableMathNumber(
        json.customValue,
        units.temperature,
      ),
      reference: createWritableMathNumber(json.reference, units.temperature),
      structureType: createSL(
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
      toJSON() {
        return {
          version: 2,
          active: this.active(),
          source: this.source.selected() || 'Tair',
          average: this.average.selected() || 'Zone',
          customValue: this.customValue.value(),
          reference: this.reference.value(),
          structureType: this.structureType.selectedIndex() || 0,
        }
      },
    }

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
