import { createHeavydynProjectLoadCorrectionParametersFromJSON } from './load'
import { createHeavydynProjectTemperatureCorrectionParametersFromJSON } from './temperature'

export const createHeavydynProjectCorrectionParametersFromJSON = (
  json: JSONHeavydynCorrectionParametersVAny,
  units: HeavydynMathUnits,
) => {
  json = upgradeJSON(json)

  return createMutable<HeavydynCorrectionParameters>({
    load: createHeavydynProjectLoadCorrectionParametersFromJSON(
      json.load,
      units,
    ),
    temperature: createHeavydynProjectTemperatureCorrectionParametersFromJSON(
      json.temperature,
      units,
    ),
  })
}

const upgradeJSON = (
  json: JSONHeavydynCorrectionParametersVAny,
): JSONHeavydynCorrectionParameters => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
