export const createFieldFromJSON = (
  json: JSONFieldVAny,
  options?: {
    reactive?: boolean
  }
) => {
  const { label, value, settings } = json

  const field: Field = {
    label,
    value: (():
      | boolean
      | number
      | string
      | SlidableNumber
      | DateValue
      | LongString
      | SelectableString => {
      switch (label) {
        case 'Comment':
        case 'Comments':
          return {
            kind: 'longString',
            value: value as string,
          }

        case 'Date':
        case 'License start':
        case 'License end':
        case 'Certificate start':
        case 'Certificate end':
          return {
            kind: 'date',
            value: value as string,
          }
        case 'Material':
          return {
            kind: 'selectableString',
            value: value as string,
            possibleValues: [
              'Silt',
              'Naturel Gravel',
              'Treated gravel',
              'Asphaltic concrete',
            ],
          }
        case 'Layer':
          return {
            kind: 'selectableString',
            value: value as string,
            possibleValues: [
              'Sub base',
              'Base',
              'Plateform',
              'Form background',
              'Seat layer',
              'Form layer',
              'Foundation layer',
              'Base layer',
              'Tread',
              'Verge',
            ],
          }
        case 'Type':
          return {
            kind: 'selectableString',
            value: value as string,
            possibleValues: [
              'Building pavement',
              'Road',
              'Building',
              'Railway',
              'Hydraulic',
              'Excavation',
              'Peripheral excavation',
              'Trench',
              'Sanitation',
            ],
          }
        case 'State':
          return {
            kind: 'selectableString',
            value: value as string,
            possibleValues: ['Dry', 'Wet', 'Soggy', 'Frozen'],
          }
        case 'GTR':
          return {
            kind: 'selectableString',
            value: value as string,
            possibleValues: [
              'N.S.',
              'A1',
              'A2',
              'A3',
              'A4',
              'B1',
              'B2',
              'B3',
              'B4',
              'B5',
              'B6',
              'C1',
              'C2',
              'D1',
              'D2',
              'D3',
            ],
          }
        default:
          return value
      }
    })(),
    settings: shallowReactive(settings),
    toString: function () {
      return typeof this.value === 'object'
        ? this.value.value.toString()
        : value.toString()
    },
    toJSON: function (): JSONField {
      return {
        ...json,
        value: this.toString(),
        settings: field.settings,
      }
    },
  }

  return options?.reactive ? shallowReactive(field) : field
}

export const findFieldInArray = (fields: Field[], label: string) =>
  fields.find((field) => field.label === label)
