import { createBaseField } from '../base'

export const createMinidynField = (json: JSONField): MinidynField => {
  switch (json.name) {
    default:
      return createBaseField(json)
  }
}
