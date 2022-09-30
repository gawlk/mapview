import { createBaseFieldFromJSON } from '../base'

export const createMinidynFieldFromJSON = (
  json: JSONBaseField
): MinidynField => {
  switch (json.label) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
