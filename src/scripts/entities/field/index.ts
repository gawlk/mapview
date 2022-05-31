export * from './base'
export * from './heavydyn'
export * from './maxidyn'
export * from './minidyn'

export const findFieldInArray = (fields: MachineField[], label: string) =>
  fields.find((field) => field.label === label)
