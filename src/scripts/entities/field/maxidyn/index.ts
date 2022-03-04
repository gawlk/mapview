import { createBaseFieldFromJSON } from '../base'

export const createMaxidynFieldFromJSON = (json: JSONField): MaxidynField => {
  switch (json.label) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
