export const gray = '#9da3ae'

export const colors: Record<ColorName, string> = {
  red: '#d97574',
  orange: '#e89856',
  amber: '#eec051',
  yellow: '#eecd50',
  lime: '#afe25a',
  green: '#76d98f',
  emerald: '#69cf9e',
  teal: '#67d0c0',
  cyan: '#65d0eb',
  sky: '#61b9f3',
  blue: '#6fa3f3',
  indigo: '#838cf1',
  violet: '#a08cf3',
  purple: '#b489f6',
  fuchsia: '#d680f3',
  pink: '#e179b5',
  rose: '#e67a8b',
}

export const baseHexColor = gray

export const upgradeColorNameFromV1ToV2 = (
  colorName: ColorNameV1,
): ColorName => (colorName === 'gray' ? 'orange' : colorName)

export const getRandomColorName = () => {
  const colorNames = Object.keys(colors)

  return colorNames[Math.floor(Math.random() * colorNames.length)] as ColorName
}

export const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}
