export const isListOfGroups = (options: DialogSelectOptionsProps) => {
  const first = options.list.at(0)

  return first && typeof first !== 'string' && !('value' in first)
}
