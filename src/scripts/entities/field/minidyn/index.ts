import { createBaseFieldFromJSON } from '../base'

export const createMinidynFieldFromJSON = (json: JSONField): MinidynField => {
  switch (json.label) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
