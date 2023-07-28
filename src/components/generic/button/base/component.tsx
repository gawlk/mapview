import { Interactive } from '/src/components'

type Props = ButtonPropsWithHTMLAttributes

export const Button = (props: Props) => {
  return (
    <Interactive component="button" kind="clickable" {...props}>
      {props.children}
    </Interactive>
  )
}
