type InteractiveProps = InteractivePropsOnly & ContainerProps

interface InteractivePropsOnly {
  readonly kind?: 'clickable' | 'focusable' | 'static'

  readonly label?: string
  readonly suffix?: string

  readonly full?: boolean

  readonly center?: boolean

  readonly icon?: IconProp
  readonly iconClass?: ClassProp
  readonly iconStyle?: StyleProp

  readonly leftIcon?: IconProp
  readonly leftIconClass?: ClassProp
  readonly leftIconStyle?: StyleProp

  readonly rightIcon?: IconProp
  readonly rightIconClass?: ClassProp
  readonly rightIconStyle?: StyleProp
}
