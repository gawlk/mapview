import { createPositionEffect, makeClickOutsideEventListener } from './scripts'

import {
  Button,
  DialogDivider,
  classPropToString,
  dialogBooleanPropsKeysObject,
  dialogButtonBooleanPropsKeysObject,
  removeProps,
} from '/src/components'

export interface Props
  extends MergePropsWithHTMLProps<
    DialogProps,
    Solid.JSX.DialogHTMLAttributes
  > {}

export default (props: Props) => {
  const [state, setState] = createStore({
    open: false,
    value: '',
  })

  const buttonProps = createMemo(
    (): ButtonPropsWithHTMLAttributes =>
      removeProps(
        mergeProps(
          props.button?.rightIcon
            ? {}
            : {
                rightIcon: IconTablerChevronRight,
                rightIconClass:
                  'group-hover:translate-x-0.5 will-change-transform',
              },
          props.button
        ),
        dialogButtonBooleanPropsKeysObject
      )
  )

  const dialogProps = removeProps(props, dialogBooleanPropsKeysObject)

  let dialog: HTMLDialogElement | undefined
  let buttonOpen: HTMLButtonElement | undefined
  let buttonClose: HTMLButtonElement | undefined

  const close = () =>
    setState({
      value: '',
      open: false,
    })

  createEffect(
    on(
      () => state.open,
      (current, previous) => {
        if (!current && previous) {
          props.onClose?.(state.value || undefined)
        }
      }
    )
  )

  onMount(() => {
    createEffect(() => {
      if (props.size === 'small' && dialog && buttonOpen) {
        createPositionEffect(dialog, buttonOpen)
      }
    })

    let clearClickEvent: (() => void) | undefined

    createEffect(() => {
      if (state.open && dialog) {
        clearClickEvent?.()

        clearClickEvent = makeClickOutsideEventListener(dialog, close)
      }
    })

    onCleanup(() => {
      clearClickEvent?.()
    })
  })

  return (
    <div class={classPropToString([props.button?.full && 'w-full'])}>
      <Button
        {...buttonProps}
        onClick={(event) => {
          // @ts-ignore
          props.button?.onClick?.(event)

          if (!state.open) {
            props.size === 'small' ? dialog?.show() : dialog?.showModal()

            setTimeout(() => setState('open', true), 1)
          }
        }}
        title={props.title}
        ref={buttonOpen}
        class={[
          props.size === 'small' ? 'md:relative' : '',
          buttonProps().class,
        ]}
      >
        <span
          class={classPropToString([
            !props.button?.center && 'text-left',
            'flex-1 truncate',
          ])}
        >
          {props.button?.text}
        </span>
      </Button>
      {/* TODO: Use `Container` component here */}
      <dialog
        {...dialogProps}
        onTransitionEnd={(event) => {
          if (event.target === dialog && !state.open) {
            dialog.close()
          }
        }}
        ref={dialog}
        class={classPropToString([
          props.full && 'h-full',

          state.open && 'open:translate-y-0 open:opacity-100',

          (() => {
            switch (props.size) {
              case 'small':
                return 'min-w-[12rem] border-2 md:absolute md:z-10 md:m-0 md:rounded-xl md:p-2'
              default:
                return `${
                  props.size === 'fullscreen'
                    ? 'h-full max-h-full'
                    : 'top-auto bottom-0 mt-[5vh] max-h-[95vh] translate-y-4 rounded-t-2xl border-t-2 md:top-[10vh] md:mt-0 md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-2xl md:border-2'
                } peer w-full max-w-full flex-col space-y-4 backdrop:bg-black/25  backdrop:backdrop-blur-sm open:flex`
            }
          })(),

          (() => {
            switch (props.color) {
              case 'transparent':
                return 'bg-transparent'
              default:
                return `bg-white`
            }
          })(),

          'border-neutral-200 p-0 text-black opacity-0 transition duration-200 motion-reduce:transform-none motion-reduce:transition-none',
        ])}
      >
        <Show when={props.size !== 'small'}>
          <div class="flex items-center px-6 pt-6">
            <Button
              ref={buttonClose}
              icon={IconTablerX}
              onClick={close}
              class="mr-4"
            />
            <h2 class="flex-grow truncate text-center text-xl font-semibold">
              {props.title}
            </h2>
            <span
              class="min-w-0 flex-1"
              style={{
                'max-width': '2.75rem',
              }}
            />
          </div>

          <Show when={props.color !== 'transparent'}>
            <DialogDivider />
          </Show>
        </Show>

        {props.sticky}

        <Show when={props.sticky}>
          <DialogDivider />
        </Show>

        <div
          class={classPropToString([
            props.size !== 'small' &&
              props.color !== 'transparent' &&
              '!my-0 px-6 pt-4 pb-6',
            'flex-1 overflow-y-auto',
          ])}
        >
          {props.children}

          <Show when={props.form}>
            <form
              class="h-full"
              method="dialog"
              onSubmit={(event) => {
                event.preventDefault()

                setState({
                  value:
                    'value' in event.submitter
                      ? (event.submitter.value as string)
                      : '',
                  open: false,
                })
              }}
            >
              {props.form}
            </form>
          </Show>
        </div>
      </dialog>
    </div>
  )
}
