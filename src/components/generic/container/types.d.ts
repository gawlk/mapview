type ContainerPropsWithHTMLAttributes = MergePropsWithHTMLProps<ContainerProps>

type ContainerProps = ContainerPropsOnly & BaseProps

interface ContainerPropsOnly extends ParentProps {
  readonly component?: string | Component

  readonly rounded?: 'full' | 'none'

  readonly orientation?: 'horizontal' | 'vertical' | 'none'

  readonly textColor?: ColorProp | null

  readonly fontSize?: SizeProp

  readonly bgColor?: ColorProp | null
  readonly bgHoverColor?: ColorProp | null

  readonly border?: boolean
  readonly borderWidth?: number
  readonly borderColor?: ColorProp | null
  readonly borderHoverColor?: ColorProp | null
}
