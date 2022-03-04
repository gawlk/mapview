import { createBaseFieldFromJSON } from '../base'

export const createHeavydynFieldFromJSON = (json: JSONField): HeavydynField => {
  switch (json.label) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
