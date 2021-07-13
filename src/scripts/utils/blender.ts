export const blend = (
  color1: string,
  color2: string,
  percentage: number = 0.5
): string => {
  if (percentage > 1 || percentage < 0) {
    Error('Percentage must be between 1 and 0')
    percentage = 0.5
  }

  const color1Array: number[] = colorToArray(color1)
  const color2Array: number[] = colorToArray(color2)

  const color3Array: number[] = [
    (1 - percentage) * color1Array[0] + percentage * color2Array[0],
    (1 - percentage) * color1Array[1] + percentage * color2Array[1],
    (1 - percentage) * color1Array[2] + percentage * color2Array[2],
  ]

  return `#${intToHex(color3Array[0])}${intToHex(color3Array[1])}${intToHex(
    color3Array[2]
  )}`
}

const colorToArray = (color: string): number[] => {
  const regexp: RegExp = new RegExp('^#?[0-9a-fA-F]{6}')

  if (!regexp.test(color)) {
    color = '#ffffff'
  }

  color = color.replace('#', '')

  return [
    parseInt(color[0] + color[1], 16),
    parseInt(color[2] + color[3], 16),
    parseInt(color[4] + color[5], 16),
  ]
}

const intToHex = (num: number): string => {
  const hex: string = Math.round(num).toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}
