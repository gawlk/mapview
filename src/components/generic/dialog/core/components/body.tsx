import { classPropToString } from '/src/components'
import { run } from '/src/scripts'

import { DialogForm } from '.'
import { HIDDEN_CLOSE_BUTTON_CLASS } from '../scripts'

interface Props extends ParentProps {
  isAttached: boolean
  close: (element?: HTMLElement) => void
  color?: ColorProp
  footer?: JSXElement // TODO
  form?: JSXElement
}

export const DialogBody = (props: Props) => {
  return (
    <div
      class={classPropToString([
        run(() => {
          if (props.color === 'transparent') return ''

          let classes = '!mt-0 '

          if (props.isAttached) {
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
        }),

        'flex-1 overflow-y-auto @container',
      ])}
      style={{
        'overscroll-behavior': 'contain',
      }}
    >
      <button
        hidden
        class={HIDDEN_CLOSE_BUTTON_CLASS}
        onClick={() => props.close()}
      />

      {props.children}

      <Show when={props.form}>
        <DialogForm close={props.close} children={props.form} />
      </Show>
    </div>
  )
}
