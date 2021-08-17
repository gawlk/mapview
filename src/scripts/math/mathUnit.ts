import { shallowReactive } from 'vue'

export const createMathUnit = (
  name: string,
  possibleSettings: [string, number][],
  options: {
    possiblePrecisions?: number[]
    currentUnit?: string
    currentPrecision?: number
    minDisplayedValue?: number
    maxDisplayedValue?: number
  } = {}
): MathUnit =>
  shallowReactive({
    name,
    possibleSettings,
    ...options,
    possiblePrecisions: options.possiblePrecisions || [0, 1, 2, 3, 4],
    currentUnit: options.currentUnit || possibleSettings[0][0],
    currentPrecision: options.currentPrecision || possibleSettings[0][1],
  })
