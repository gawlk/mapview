import { createBaseFieldFromJSON } from '../base'

export const createMaxidynFieldFromJSON = (
  json: JSONBaseField
): MaxidynField => {
  switch (json.label) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
