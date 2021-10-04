import { createBaseField } from '../base'

export const createMaxidynField = (json: JSONField): MaxidynField => {
  switch (json.name) {
    default:
      return createBaseField(json)
  }
}
