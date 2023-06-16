export const average = (values: number[]) =>
  values.reduce((total, currentValue) => total + currentValue, 0) /
  values.length

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
