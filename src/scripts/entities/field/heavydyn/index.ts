import { createBaseFieldFromJSON } from '../base'

export const createHeavydynFieldFromJSON = (json: JSONField): HeavydynField => {
  switch (json.name) {
    default:
      return createBaseFieldFromJSON(json)
  }
}
