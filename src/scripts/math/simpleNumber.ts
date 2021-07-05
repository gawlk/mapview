import { shallowReactive } from 'vue'

export const createSimpleNumber = (
  value: number,
  unit: string
): SimpleNumber => {
  return shallowReactive({
    value,
    unit,
  })
}
