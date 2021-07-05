import { shallowReactive } from 'vue'

export const createMathUnit = (
  name: string,
  possibleSettings: [string, number][],
  locked: boolean = false,
  possiblePrecisions: number[] = [0, 1, 2, 3, 4],
  currentUnit?: string,
  currentPrecision?: number
): MathUnit => {
  return shallowReactive({
    name,
    possibleSettings,
    locked,
    possiblePrecisions,
    currentUnit: currentUnit || possibleSettings[0][0],
    currentPrecision: currentPrecision || possibleSettings[0][1],
  })
}
