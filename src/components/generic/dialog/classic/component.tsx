import {
  classPropToString,
  dialogClassicBooleanPropsKeysObject,
  DialogCore,
  removeProps,
} from '/src/components'
import { createASS } from '/src/scripts'

import { DialogButtonOpen } from './components/buttonOpen'

type Props = DialogClassicProps

export const Dialog = (props: Props) => {
  const state = {
    button: createASS(undefined as HTMLButtonElement | undefined),
    id: createASS(''),
  }

  let toggleDialog: DialogToggleFunction | undefined

  const dialogProps = removeProps(props, dialogClassicBooleanPropsKeysObject)

  return (
    <div class={classPropToString([props.button?.full && 'w-full min-w-0'])}>
      <DialogButtonOpen
        {...props.button}
        for={state.id()}
        class={[!!props.attached && 'md:relative', props.button?.class]}
        title={props.button?.title || props.title}
        ref={(button) => {
          state.button.set(button)
          const propRef = props.button?.ref

          if (typeof propRef === 'function') {
            propRef(button)
          }
        }}
        onClick={(event) => {
          // Types failing
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          props.button?.onClick?.(event)

          toggleDialog?.(event.isTrusted)
        }}
      />

      <DialogCore
        {...dialogProps}
        title={props.title || props.button?.text?.toString()}
        {...(props.attached ? { attach: () => state.button() } : {})}
        onIdCreated={state.id.set}
        onToggleCreated={(toggle) => {
          toggleDialog = toggle
        }}
      />
    </div>
  )
}
