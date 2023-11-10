import { createASS, createSL, createWritableMathNumber } from '/src/scripts'

export const createHeavydynProjectLoadCorrectionParametersFromJSON = (
  json: JSONHeavydynLoadCorrectionParametersVAny,
  units: HeavydynMathUnits,
) => {
  json = upgradeJSON(json)

  const loadCorrectionParameters: HeavydynLoadCorrectionParameters = {
    active: createASS(json.active),
    source: createSL(['Sequence', 'Custom'] as LoadSourceList, {
      selected: json.source,
    }),
    customValue: createWritableMathNumber(json.customValue, units.force),
    toJSON() {
      return {
        version: 2,
        active: this.active(),
        source: this.source.selected() || 'Sequence',
        customValue: this.customValue.value(),
      }
    },
  }

  return loadCorrectionParameters
}

const upgradeJSON = (
  json: JSONHeavydynLoadCorrectionParametersVAny,
): JSONHeavydynLoadCorrectionParameters => {
  switch (json.version) {
    case 1:
      json = {
        ...json,
        version: 2,
        source: json.loadReferenceSource,
      }
  }

  return json
}
