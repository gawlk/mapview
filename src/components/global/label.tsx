import { classPropToString } from '/src/components'

export interface Props extends Solid.ParentProps, BaseProps {
  label: string | Solid.JSX.Element
}

export default (props: Props) => {
  const id = `${props.label}-${Math.random()}`

  return (
    <div class="space-y-2">
      <label
        for={id}
        class={classPropToString([
          (() => {
            switch (props.size) {
              case 'lg':
                return 'text-xl'
              default:
                return 'text-lg'
            }
          })(),

          'break-words font-semibold',
        ])}
      >
        {props.label}
      </label>
      <div id={id} class={classPropToString(props.class) || 'space-y-2'}>
        {props.children}
      </div>
    </div>
  )
}
