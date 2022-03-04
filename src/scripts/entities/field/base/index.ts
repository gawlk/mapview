export const createBaseFieldFromJSON = (
  json: JSONField,
  reactive?: boolean
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

  const { label, value } = json

  const field: MachineField = (() => {
    switch (label) {
      case 'Comment':
      case 'Comments':
        return {
          label,
          value: {
            kind: 'longString',
            value: value as string,
          },
        }
      case 'Date':
        return {
          label,
          value: {
            kind: 'date',
            value: value as string,
          },
        }
      default:
        return {
          label,
          value,
        }
    }
  })()

  return reactive ? shallowReactive(field) : field
}
