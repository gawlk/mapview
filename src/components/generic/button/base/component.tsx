import { Interactive } from '/src/components'

type Props = ButtonPropsWithHTMLAttributes

export const Button = (props: Props) => {
  const bgColor = createMemo(() => props.color || 'base')

  return (
    <Interactive
      component="button"
      kind="clickable"
      color="base"
      bgColor={bgColor()}
      bgHoverColor={bgColor()}
      borderColor="transparent"
      {...props}
    >
      {props.children}
    </Interactive>
  )
}
