import { createBaseFieldFromJSON } from '../base'

export const createMinidynFieldFromJSON = (json: JSONField): MinidynField => {
  switch (json.name) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
