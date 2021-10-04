import { createComputedData } from '/src/scripts'

export const createBaseDrop = (rawData: unknown): BaseDrop => {
  const data = createComputedData(rawData)

  return {
    data,
    additionnalFields: [],
  }
}
