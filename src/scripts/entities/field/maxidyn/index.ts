import { createBaseFieldFromJSON } from '../base'

export const createMaxidynFieldFromJSON = (json: JSONField): MaxidynField => {
  switch (json.name) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
