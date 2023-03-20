export const average = (values: number[]) => {
  const decimalPoint =
    String(Math.min(...values))
      .split('.')
      .at(1)?.length || 0

  const multiplier = 10 ** decimalPoint

  return (
    // Math.round(
    values.reduce((total, currentValue) => total + currentValue, 0) /
    values.length
    //     multiplier
    // ) / multiplier
  )
}
