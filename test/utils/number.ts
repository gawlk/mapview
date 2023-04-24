export const toXDecimal = (value: number, decimal: number = 6) => {
  const integerPart = Math.floor(value)
  const decimalPart = (value - integerPart).toFixed(decimal)

  return integerPart + decimalPart
}
