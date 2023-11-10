import { createHeavydynProjectLoadCorrectionParametersFromJSON } from './load'
import { createHeavydynProjectTemperatureCorrectionParametersFromJSON } from './temperature'

export const createHeavydynProjectCorrectionParametersFromJSON = (
  json: JSONHeavydynCorrectionParametersVAny,
  units: HeavydynMathUnits,
) => {
  json = upgradeJSON(json)

  const correctionParameters: HeavydynCorrectionParameters = {
    load: createHeavydynProjectLoadCorrectionParametersFromJSON(
      json.load,
      units,
    ),
    temperature: createHeavydynProjectTemperatureCorrectionParametersFromJSON(
      json.temperature,
      units,
    ),
    toJSON() {
      return {
        version: 1,
        load: this.load.toJSON(),
        temperature: this.temperature.toJSON(),
      }
    },
  }

  return correctionParameters
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
