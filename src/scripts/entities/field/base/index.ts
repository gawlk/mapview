export const createBaseField = (json: JSONField): Field => {
  // {
  //   name: 'Slidable number',
  //   value: {
  //     kind: 'slidableNumber',
  //     value: 50,
  //     step: 5,
  //     min: 10,
  //     max: 1000,
  //   },
  // } as Field,

  // {
  //   name: 'Selectable string',
  //   value: {
  //     kind: 'selectableString',
  //     value: 'value',
  //     strict: false,
  //     possibleValues: ['valeur 1', 'valeur 2', 'valeur 3'],
  //   },
  // } as Field,

  const { name, value } = json

  switch (name) {
    case 'Comment':
      return {
        name,
        value: {
          kind: 'longString',
          value: value as string,
        },
      }
    case 'Date':
      return {
        name,
        value: {
          kind: 'date',
          value: value as string,
        },
      }
    default:
      return {
        name,
        value,
      }
  }
}
