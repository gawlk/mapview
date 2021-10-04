import { createBaseField } from '../base'

export const createHeavydynField = (json: JSONField): HeavydynField => {
  switch (json.name) {
    default:
      return createBaseField(json)
  }
}
