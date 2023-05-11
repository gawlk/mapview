export interface GenericContainerProps {
  // Element
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element?: any

  // Sizes
  xxxl?: boolean
  xxl?: boolean
  xl?: boolean
  lg?: boolean
  sm?: boolean

  // Full
  full?: boolean

  // Directions
  horizontal?: boolean
  vertical?: boolean

  // Round
  rounded?: boolean

  // Colors
  colorless?: boolean
  transparent?: boolean
  primary?: boolean
  secondary?: boolean
  tertiary?: boolean
  black?: boolean
  red?: boolean
  orange?: boolean
  amber?: boolean
  yellow?: boolean
  lime?: boolean
  green?: boolean
  emerald?: boolean
  teal?: boolean
  cyan?: boolean
  sky?: boolean
  blue?: boolean
  indigo?: boolean
  violet?: boolean
  purple?: boolean
  fuchsia?: boolean
  pink?: boolean
  rose?: boolean

  // States
  clickable?: boolean
  focusable?: boolean
  disabled?: boolean

  // Illustrations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  svg?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leftSvg?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rightSvg?: any
  src?: string
  leftSrc?: string
  rightSrc?: string

  // Classes
  containerClasses?: string
  illustrationClasses?: string
  leftIllustrationClasses?: string
  rightIllustrationClasses?: string
}

export interface GenericIllustrationProps extends GenericContainerProps {
  right?: boolean
}
