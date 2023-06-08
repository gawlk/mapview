import { currentCategory, indicatorsCategory, rawCategory } from '/src/scripts'

// TODO: Figure out why without PulseTime current goes after Raw, WTF

const categoriesOrder = [currentCategory, rawCategory, indicatorsCategory]

export const groupDataLabelsByCategory = (dataLabels: DataLabel[]) =>
  Array.from(
    dataLabels.reduce((map, dataLabel) => {
      const { category } = dataLabel

      const list = map.get(category) || []

      list.push(dataLabel)

      map.set(category, list)

      return map
    }, new Map<DataCategory, DataLabel[]>())
  ).sort(
    ([categoryA], [categoryB]) =>
      categoriesOrder.indexOf(categoryA) - categoriesOrder.indexOf(categoryB)
  )
