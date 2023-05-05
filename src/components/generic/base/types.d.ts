type BaseProps = BasePropsOnly

interface BasePropsOnly {
  disabled?: boolean

  size?: '2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs'

  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'gray'
    | 'red'
    | 'green'
    | 'orange'
    | 'transparent'

  class?: ClassProp

  style?: StyleProp
}
