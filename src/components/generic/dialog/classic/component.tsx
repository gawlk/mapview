import {
  DialogCore,
  classPropToString,
  dialogClassicBooleanPropsKeysObject,
  removeProps,
} from '/src/components'

import { DialogButtonOpen } from './components/buttonOpen'

type Props = DialogClassicProps

export const Dialog = (props: Props) => {
  const [state, setState] = createStore({
    button: undefined as HTMLButtonElement | undefined,
    id: '',
  })

  let toggleDialog: DialogToggleFunction | undefined

  const dialogProps = removeProps(props, dialogClassicBooleanPropsKeysObject)

  return (
    <div class={classPropToString([props.button?.full && 'w-full'])}>
      <DialogButtonOpen
        {...props.button}
        for={state.id}
        class={[!!props.attached && 'md:relative', props.button?.class]}
        title={props.button?.title || props.title}
        ref={(button) => setState('button', button)}
        onClick={(event) => {
          // @ts-ignore
          props.button?.onClick?.(event)

          toggleDialog?.(event.isTrusted)
        }}
      />

      <DialogCore
        {...dialogProps}
        title={props.title || props.button?.text?.toString()}
        {...(props.attached ? { attach: state.button } : {})}
        onIdCreated={(id) => setState('id', id)}
        onToggleCreated={(toggle) => (toggleDialog = toggle)}
      />
    </div>
  )
}
