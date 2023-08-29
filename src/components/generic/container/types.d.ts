type ContainerPropsWithHTMLAttributes = MergePropsWithHTMLProps<ContainerProps>

type ContainerProps = ContainerPropsOnly & BaseProps

interface ContainerPropsOnly extends ParentProps {
  component?: string | Component

  rounded?: 'full' | 'none'

  orientation?: 'horizontal' | 'vertical' | 'none'

  textColor?: ColorProp | null

  bgColor?: ColorProp | null
  bgHoverColor?: ColorProp | null

  border?: boolean
  borderWidth?: number
  borderColor?: ColorProp | null
  borderHoverColor?: ColorProp | null
}
