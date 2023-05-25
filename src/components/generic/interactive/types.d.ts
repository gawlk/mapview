type InteractiveProps = InteractivePropsOnly & ContainerProps

interface InteractivePropsOnly {
  kind?: 'clickable' | 'focusable' | 'static'

  label?: string

  full?: boolean

  center?: boolean

  icon?: IconProp
  iconClass?: ClassProp
  iconStyle?: StyleProp

  leftIcon?: IconProp
  leftIconClass?: ClassProp
  leftIconStyle?: StyleProp

  rightIcon?: IconProp
  rightIconClass?: ClassProp
  rightIconStyle?: StyleProp
}
