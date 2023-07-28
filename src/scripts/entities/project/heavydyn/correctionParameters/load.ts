import { createMathNumber, createSelectableList } from '/src/scripts'

export const createHeavydynProjectLoadCorrectionParametersFromJSON = (
  json: JSONHeavydynLoadCorrectionParametersVAny,
  units: HeavydynMathUnits
) => {
  json = upgradeJSON(json)

  const loadCorrectionParameters: HeavydynLoadCorrectionParameters =
    createMutable({
      active: false,
      source: createSelectableList(['Sequence', 'Custom'] as LoadSourceList, {
        selected: json.source,
      }),
      customValue: createMathNumber(json.customValue, units.force),
    })

  return loadCorrectionParameters
}

const upgradeJSON = (
  json: JSONHeavydynLoadCorrectionParametersVAny
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
