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
  | 'transparent'

interface BasePropsOnly {
  disabled?: boolean

  size?: SizeProp

  padding?: SizeProp

  color?: ColorProp

  class?: ClassProp

  style?: StyleProp
}
