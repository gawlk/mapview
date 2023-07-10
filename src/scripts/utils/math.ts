export const average = (values: number[]) =>
  values.reduce((total, currentValue) => total + currentValue, 0) /
  values.length

export const roundValue = (value: number, decimals = 5) => {
  const tenPowerX = 10 ** decimals
  return Math.round(value * tenPowerX) / tenPowerX
}
