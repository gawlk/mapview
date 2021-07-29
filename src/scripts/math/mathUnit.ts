import { shallowReactive } from 'vue'

export const createMathUnit = (
  name: string,
  possibleSettings: [string, number][],
  options: {
    possiblePrecisions?: number[]
    currentUnit?: string
    currentPrecision?: number
    min?: number
    max?: number
  } = {}
): MathUnit => {
  return shallowReactive({
    name,
    possibleSettings,
    possiblePrecisions: options.possiblePrecisions || [0, 1, 2, 3, 4],
    currentUnit: options.currentUnit || possibleSettings[0][0],
    currentPrecision: options.currentPrecision || possibleSettings[0][1],
    min: options.min,
    max: options.max,
  })
}
