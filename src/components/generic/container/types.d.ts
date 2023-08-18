type ContainerPropsWithHTMLAttributes = MergePropsWithHTMLProps<ContainerProps>

type ContainerProps = ContainerPropsOnly & BaseProps

interface ContainerPropsOnly extends Solid.ParentProps {
  component?: string | Solid.Component

  rounded?: 'full' | 'none'

  orientation?: 'horizontal' | 'vertical' | 'none'

  textColor?: ColorProp

  bgColor?: ColorProp
  bgHoverColor?: ColorProp

  border?: boolean
  borderWidth?: number
  borderColor?: ColorProp
  borderHoverColor?: ColorProp
}
