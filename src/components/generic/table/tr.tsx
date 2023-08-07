import { hexToRgb } from '/src/scripts'

import { classPropToString } from '/src/components'

interface Props extends Solid.ParentProps, Sortable {
  color?: string
  class?: ClassProp
}

export const Tr = (props: Props) => {
  return (
    <tr
      ref={props.ref}
      {...props}
      style={
        props.color
          ? {
              'background-color': `rgb(${hexToRgb(props.color)?.join(
                ' '
              )} / var(--tw-bg-opacity))`,
            }
          : {}
      }
      class={classPropToString([
        props.class,
        'sortable border-b-2 border-black/10 bg-opacity-[0.2] px-1 py-1 text-black last:border-b-0',
      ])}
    >
      {props.children}
    </tr>
  )
}
