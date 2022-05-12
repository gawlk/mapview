export const createBaseFieldFromJSON = (
  json: JSONField,
  options?: {
    reactive?: boolean
  }
): MachineField => {
  // {
  //   name: 'Slidable number',
  //   value: {
  //     kind: 'slidableNumber',
  //     value: 50,
  //     step: 5,
  //     min: 10,
  //     max: 1000,
  //   },
  // } as MachineField,

  // {
  //   name: 'Selectable string',
  //   value: {
  //     kind: 'selectableString',
  //     value: 'value',
  //     strict: false,
  //     possibleValues: ['valeur 1', 'valeur 2', 'valeur 3'],
  //   },
  // } as MachineField,

  const { label, value, settings } = json

  const field: MachineField = {
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
        default:
          return value
      }
    })(),
    settings: shallowReactive(settings),
  }

  console.log(settings, field)

  return options?.reactive ? shallowReactive(field) : field
}
