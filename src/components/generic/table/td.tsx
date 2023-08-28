import { classPropToString } from '/src/components'

interface Props extends ParentProps {
  wide?: boolean
  class?: ClassProp
  text?: 'center' | 'right'
}

export const Td = (props: Props) => {
  return (
    <td
      class={classPropToString([
        props.text && (props.text === 'center' ? 'text-center' : 'text-right'),
        props.wide ? 'px-4' : 'px-1',
        'py-1',
        props.class,
      ])}
    >
      {props.children}
    </td>
  )
}
