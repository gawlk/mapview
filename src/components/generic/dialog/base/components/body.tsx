import { classPropToString } from '/src/components'

import { DialogForm } from '.'
import { HIDDEN_CLOSE_BUTTON_CLASS } from '../scripts'

interface Props extends Solid.ParentProps {
  isAbsolute: boolean
  color?: ColorProp
  footer?: Solid.JSX.Element
  form?: Solid.JSX.Element
}

export default (props: Props) => {
  return (
    <div
      class={classPropToString([
        (() => {
          if (props.color === 'transparent') return ''

          let classes = '!mt-0 '

          if (props.isAbsolute) {
            classes += `px-2 `
            if (props.footer) {
              classes += 'py-1.5'
            } else {
              classes += 'py-2'
            }
          } else {
            // TODO: Fix padding mess + pt-4 when nothing other than children
            classes += 'px-4 py-3'
            // if (props.footer) {
            //   classes += 'py-3'
            // } else {
            //   classes += 'py-4'
            // }
          }

          return classes
        })(),

        'flex-1 overflow-y-auto',
      ])}
    >
      <button
        hidden
        class={HIDDEN_CLOSE_BUTTON_CLASS}
        onClick={() => close()}
      />

      {props.children}

      <Show when={props.form}>
        <DialogForm close={close} children={props.form} />
      </Show>
    </div>
  )
}
