import { classPropToString } from '/src/components'

interface Props extends ParentProps {
  wide?: boolean
  class?: ClassProp
  text?: 'center' | 'right'
  dataSaveable?: boolean
  dataValue?: string
}

export const Td = (props: Props) => {
  return (
    <td
      {...props}
      class={classPropToString([
        props.text && (props.text === 'center' ? 'text-center' : 'text-right'),
        props.wide ? 'px-4' : 'px-1',
        'py-1',
        props.class,
      ])}
      data-saveable={props.dataSaveable}
      data-value={props.dataValue}
    >
      {props.children}
    </td>
  )
}
