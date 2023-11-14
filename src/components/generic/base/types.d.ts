type BaseProps = BasePropsOnly

type SizeProp = '2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs'

type ColorProp =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'base'
  | 'gray'
  | 'red'
  | 'green'
  | 'orange'
  | 'yellow'
  | 'violet'
  | 'transparent'

interface BasePropsOnly {
  readonly disabled?: boolean

  readonly size?: SizeProp

  readonly padding?: SizeProp | boolean

  readonly color?: ColorProp

  readonly class?: ClassProp

  readonly style?: StyleProp
}
