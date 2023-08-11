export const computeAverage = (values: number[]) =>
  values.reduce((total, currentValue) => total + currentValue, 0) /
  values.length

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const roundValue = (value: number, decimals = 5) => {
  const tenPowerX = 10 ** decimals
  return Math.round(value * tenPowerX) / tenPowerX
}

export const computeStandardDeviation = (values: number[]) => {
  const valuesAverage = computeAverage(values)

  const variance = computeAverage(
    values.map((x) => {
      const deviation = x - valuesAverage
      return deviation ** 2
    }),
  )

  return Math.sqrt(variance)
}
