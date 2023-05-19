export const isListOfGroups = (options: DialogValuesProps) => {
  const first = options.list.at(0)

  return first && typeof first !== 'string' && !('value' in first)
}
