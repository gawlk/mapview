import { roundValue } from '/src/scripts'

export const roundToMicroValue = (value: number, decimal = 6) => 
  roundValue(value, decimal)

