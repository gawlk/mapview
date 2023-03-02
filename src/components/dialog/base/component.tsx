import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom'
import { makeEventListener } from '@solid-primitives/event-listener'
import { useWindowSize } from '@solid-primitives/resize-observer'

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

  onMount(() => {
    const windowSize = useWindowSize()

    let cleanup: (() => void) | undefined
    createEffect(() => {
      cleanup?.()
      if (
        props.size === 'small' &&
        buttonOpen &&
        dialog &&
        windowSize.width &&
        window.getComputedStyle(dialog).position === 'absolute'
      ) {
        cleanup = autoUpdate(
          buttonOpen,
          dialog,
          () =>
            buttonOpen &&
            dialog &&
            computePosition(buttonOpen, dialog, {
              middleware: [
                offset(4),
                flip(),
                shift({
                  padding: 5,
                }),
              ],
            }).then(({ x, y }) => {
              if (dialog) {
                Object.assign(dialog.style, {
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${buttonOpen?.clientWidth}px`,
                })
              }
            })
        )
      }
    })

    let click: (() => void) | undefined
    createEffect(() => {
      if (state.open) {
        click?.()
        click = makeEventListener(
          window,
          'click',
          (event) => {
            if (dialog) {
              const { pageX, pageY } = event
              const { top, right, bottom, left } =
                dialog.getBoundingClientRect()

              if (
                pageX < left ||
                pageY < top ||
                pageX > right ||
                pageY > bottom
              ) {
                close()
              }
            }
          },
          { passive: true }
        )
      }
    })

    onCleanup(() => {
      cleanup?.()
      click?.()
    })
  })

  return (
    <div class={classPropToString([props.button?.full && 'w-full'])}>
      <Button
        {...buttonProps}
        onClick={() => {
          if (!state.open) {
            props.size === 'small' ? dialog?.show() : dialog?.showModal()

            setTimeout(() => {
              setState('open', true)
            }, 1)
          }
        }}
        title={props.title}
        ref={buttonOpen}
        class={props.size === 'small' ? 'md:relative' : ''}
      >
        <span
          class={classPropToString([
            props.button?.center ? ' text-center' : ' text-left',
            'flex-1 truncate',
          ])}
        >
          {props.button?.text}
        </span>
      </Button>
      <dialog
        {...dialogProps}
        onClose={() => props.onClose?.(state.value || undefined)}
        onTransitionEnd={(event) => {
          if (event.target === dialog && !state.open) {
            dialog.close()
          }
        }}
        ref={dialog}
        class={classPropToString([
          props.full && 'h-full',
          state.open && 'open:translate-y-0 open:opacity-100',
          props.size === 'small'
            ? 'md:absolute md:z-10 md:m-0 md:rounded-xl md:p-2'
            : 'peer top-auto bottom-0 mt-[5vh] max-h-[95vh] w-full max-w-full translate-y-4 flex-col space-y-4 rounded-t-2xl border-t-2 p-6 pb-0  backdrop:bg-black/25 backdrop:backdrop-blur-sm open:flex  md:top-[10vh] md:mt-0 md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-2xl md:border-2',
          'border-2 border-neutral-200 bg-white text-black opacity-0 transition duration-200 motion-reduce:transform-none motion-reduce:transition-none',
        ])}
      >
        <Show when={props.size !== 'small'}>
          <div class="flex items-center">
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

          <DialogDivider />
        </Show>

        {props.sticky}

        <Show when={props.sticky}>
          <DialogDivider />
        </Show>

        <div
          class={classPropToString([
            props.size !== 'small' ? '!my-0 -mx-4 p-4 pb-6' : '',
            'flex-1 overflow-y-auto',
          ])}
        >
          {props.children}
          <form
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
        </div>
      </dialog>
    </div>
  )
}
