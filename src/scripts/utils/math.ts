export const average = (values: number[]) =>
  values.reduce((total, currentValue) => total + currentValue, 0) /
  values.length
