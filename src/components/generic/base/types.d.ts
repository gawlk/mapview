type BaseProps = BasePropsOnly

type Size = '2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs'

interface BasePropsOnly {
  disabled?: boolean

  size?: Size

  padding?: Size

  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'gray'
    | 'red'
    | 'green'
    | 'orange'
    | 'yellow'
    | 'transparent'

  class?: ClassProp

  style?: StyleProp
}
