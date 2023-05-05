import { unwrap } from 'solid-js/store'

export const rawCategory: DataCategory = {
  name: 'Raw',
  saveable: true,
  neededInExcelName: true,
}

export const isRawCategory = (category: DataCategory) =>
  unwrap(category) === rawCategory

export const currentCategory: DataCategory = {
  name: 'Current',
}

export const isCurrentCategory = (category: DataCategory) =>
  unwrap(category) === currentCategory
