type BaseProps = BasePropsOnly

type SizeProp = '2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs'

type ColorProp =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'gray'
  | 'red'
  | 'green'
  | 'orange'
  | 'yellow'
  | 'violet'
  | 'transparent'

interface BasePropsOnly {
  disabled?: boolean

  size?: SizeProp

  padding?: SizeProp | boolean

  color?: ColorProp

  class?: ClassProp

  style?: StyleProp
}
