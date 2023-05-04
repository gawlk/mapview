import { createHeavydynProjectLoadCorrectionParametersFromJSON } from './load'
import { createHeavydynProjectTemperatureCorrectionParametersFromJSON } from './temperature'

export const createHeavydynProjectCorrectionParametersFromJSON = (
  json: JSONHeavydynCorrectionParametersVAny,
  units: HeavydynMathUnits
) => {
  json = upgradeJSON(json)

  const correctionParameters: HeavydynCorrectionParameters = shallowReactive({
    load: createHeavydynProjectLoadCorrectionParametersFromJSON(
      json.load,
      units
    ),
    temperature: createHeavydynProjectTemperatureCorrectionParametersFromJSON(
      json.temperature,
      units
    ),
  })

  return correctionParameters
}

const upgradeJSON = (
  json: JSONHeavydynCorrectionParametersVAny
): JSONHeavydynCorrectionParameters => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
