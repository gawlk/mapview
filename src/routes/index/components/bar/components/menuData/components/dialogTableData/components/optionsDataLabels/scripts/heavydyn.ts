import { currentCategory, indicatorsCategory, rawCategory } from '/src/scripts'

export const insertHeavydynDataLabel = (
  dataLabel: DataLabel,
  list: DataLabel[],
) => {
  const categories = [rawCategory, currentCategory, indicatorsCategory]

  const findCategoryIndex = (_dataLabel: DataLabel) =>
    categories.findIndex(
      (category) => category.name === _dataLabel.category.name,
    )

  const dataLabelCategoryIndex = findCategoryIndex(dataLabel)

  let maxIndex = list.findIndex(
    (_dataLabel) => findCategoryIndex(_dataLabel) > dataLabelCategoryIndex,
  )
  maxIndex = maxIndex === -1 ? list.length : maxIndex

  let minIndex = list.findIndex(
    (_dataLabel) =>
      categories.indexOf(_dataLabel.category) === dataLabelCategoryIndex,
  )
  minIndex = Math.min(minIndex === -1 ? 0 : minIndex, maxIndex)

  const isLoad = (name: string) => name === 'Load'
  const isDeflection = (name: string) => name.startsWith('D')
  const convertDeflectionNameToValue = (deflection: string) =>
    Number(deflection.split('D').pop())

  if (maxIndex !== minIndex) {
    const { name } = dataLabel
    const value = convertDeflectionNameToValue(name)

    if (isDeflection(name)) {
      const newIndex = list
        .slice(minIndex, maxIndex)
        .map((_dataLabel) => _dataLabel.name)
        .findIndex((_name) => {
          const isNeitherLoadNorDeflection =
            !isLoad(_name) && !isDeflection(_name)

          const isHigherDeflection =
            isDeflection(_name) && value < convertDeflectionNameToValue(_name)

          return isNeitherLoadNorDeflection || isHigherDeflection
        })

      list.splice(newIndex === -1 ? maxIndex : newIndex, 0, dataLabel)
    } else if (isLoad(name)) {
      list.splice(minIndex, 0, dataLabel)
    } else {
      // TimePulse
      list.splice(maxIndex, 0, dataLabel)
    }
  } else {
    list.splice(maxIndex, 0, dataLabel)
  }
}
