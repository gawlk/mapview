import { shallowReactive } from 'vue'

export const createProject = (name: string): Project => {
  return shallowReactive({
    name,
    reports: [],
    images: [],
    linkPoints: true,
    lockPoints: true,
    database: undefined,
    additionnalFields: undefined,
  })
}
