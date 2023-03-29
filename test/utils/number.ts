export const toFiveDecimal = (value: number) => {
  const integerPart = Math.floor(value)
  const decimalPart = (value - integerPart).toFixed(5)

  return integerPart + decimalPart
}
