import { currentCategory, indicatorsCategory, rawCategory } from '/src/scripts'

// TODO: Figure out why without PulseTime current goes after Raw, WTF

export const groupDataLabelsByCategory = (dataLabels: DataLabel[]) =>
  Array.from(
    dataLabels.reduce((map, dataLabel) => {
      const { category } = dataLabel

      const list = map.get(category) || []

      list.push(dataLabel)

      map.set(category, list)

      return map
    }, new Map<DataCategory, DataLabel[]>())
  ).sort((a, b) => {
    const categoryA = a[0]
    const categoryB = b[0]

    const order = [currentCategory, rawCategory, indicatorsCategory]

    return order.indexOf(categoryA) - order.indexOf(categoryB)
  })
