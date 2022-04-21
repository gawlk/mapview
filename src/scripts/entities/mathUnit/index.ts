export const createMathUnit = <PossibleUnits extends string>(
  name: string,
  baseUnit: string,
  possibleSettings: [PossibleUnits, number][],
  options: {
    currentUnit: PossibleUnits
    possiblePrecisions?: number[]
    currentPrecision?: number
    min?: number
    max?: number
    step?: number
  }
): MathUnit => {
  const currentUnit = options.currentUnit || possibleSettings[0][0]
  const possiblePrecisions = options.possiblePrecisions || [0, 1, 2]
  const currentPrecision = options.currentPrecision || possibleSettings[0][1]
  const min = options.min || 0
  const max = options.max || 1000
  const step = options.step || 1

  return shallowReactive({
    name,
    baseUnit,
    possibleSettings,
    currentUnit,
    possiblePrecisions,
    currentPrecision,
    min,
    max,
    step,
  })
}
