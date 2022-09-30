import { createBaseFieldFromJSON } from '../base'

export const createHeavydynFieldFromJSON = (
  json: JSONBaseField
): HeavydynField => {
  switch (json.label) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
