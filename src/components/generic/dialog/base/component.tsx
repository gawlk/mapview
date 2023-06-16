import { createMediaQuery } from '@solid-primitives/media'
import {
  createElementSize,
  useWindowSize,
} from '@solid-primitives/resize-observer'
import defaultTailwindCSSTheme from 'tailwindcss/defaultTheme'

import {
  createRelativePositionEffect,
  forceCloseChildDialogs,
  makeClickOutsideEventListener,
  openForcedClosedChildDialogs,
} from './scripts'

import {
  DialogBackdrop,
  DialogBody,
  DialogButtonOpen,
  DialogDivider,
  DialogForm,
  DialogHeader,
  DialogLinesDefaultPosition,
  DialogResizers,
} from './components'

import {
  classPropToString,
  dialogBooleanPropsKeysObject,
  removeProps,
} from '/src/components'

export interface Props
  extends MergePropsWithHTMLProps<
    DialogProps,
    Solid.JSX.DialogHTMLAttributes
  > {}

export default (props: Props) => {
  const [state, setState] = createStore({
    show: false,
    open: false,
    maximized: false,
    value: '',
    position: {
      left: undefined,
      top: undefined,
    } as DialogPosition,
    dimensions: {
      width: undefined,
      height: undefined,
    } as DialogDimensions,
    zIndex: 0,
    moving: false,
  })

  const dialogProps = removeProps(props, dialogBooleanPropsKeysObject)

  // TODO: On window resize hide dialog if open button isn't visible on screen (hidden by parent for example)

  let buttonOpen: HTMLButtonElement | undefined
  const forcedClosedChildDialogsOpenButtons: HTMLButtonElement[] = []

  const isWindowLarge = createMediaQuery(
    `(min-width: ${defaultTailwindCSSTheme.screens.md})`
  )
  const isAble = createMemo(() => props.moveable || props.resizable)
  const isAttached = createMemo(() => !!props.attached)
  const isMaximized = createMemo(() => props.maximized || state.maximized)
  const isModal = createMemo(
    () => isWindowLarge() && !(isAttached() || isAble())
  )
  const id = createMemo(
    () =>
      `dialog-${(props.title || props.button?.text?.toString())
        ?.toLowerCase()
        .replaceAll(' ', '-')}-${Math.floor(Math.random() * 100000000)}`
  )
  const defaultLeft = createMemo(() =>
    state.show ? (useWindowSize().width - dialogWidth()) / 2 : 0
  )
  const defaultTop = createMemo(() => Math.round(useWindowSize().height / 10))

  const [dialog, setDialog] = createSignal<HTMLDialogElement | undefined>(
    undefined
  )
  const [dialogsDiv, setDialogsDiv] = createSignal<HTMLElement | undefined>(
    undefined
  )

  const dialogDimensions = createElementSize(dialog)
  const dialogWidth = createMemo(
    () => (dialogDimensions.width && dialog()?.offsetWidth) || 0
  )

  const moveToFront = () => {
    const baseZIndex = 100

    const list = dialogsDiv()?.getElementsByTagName('dialog')

    const zIndexes = Array.from(list || [])
      .filter((dialog) => dialog.open)
      .map((dialog) => (Number(dialog.style.zIndex) || baseZIndex) - baseZIndex)

    const maxZIndex = zIndexes.length ? Math.max(...zIndexes) : 0

    setState('zIndex', baseZIndex + maxZIndex + 1)
  }

  const close = (element?: HTMLElement) => {
    forceCloseChildDialogs(dialog(), forcedClosedChildDialogsOpenButtons)

    const value = String(
      element && 'value' in element ? element.value ?? '' : ''
    )

    setState({
      value,
      open: false,
    })
  }

  onMount(() => {
    setDialogsDiv(document.getElementById('dialogs') || undefined)

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

    createEffect(() => {
      if (isAttached() && buttonOpen) {
        createRelativePositionEffect(dialog(), buttonOpen)
      }
    })

    let clearClickEvent: (() => void) | undefined
    createEffect(() => {
      clearClickEvent?.()
      if (isAttached() && state.open) {
        clearClickEvent = makeClickOutsideEventListener(dialog(), close)
      }
    })

    onCleanup(() => {
      clearClickEvent?.()
    })
  })

  return (
    <div class={classPropToString([props.button?.full && 'w-full'])}>
      <DialogButtonOpen
        {...props.button}
        for={id()}
        class={[isAttached() && 'md:relative', props.button?.class]}
        title={props.title}
        ref={buttonOpen}
        onClick={(event) => {
          // @ts-ignore
          props.button?.onClick?.(event)

          if (!state.open) {
            const isUserEvent = event.isTrusted

            const noChildrenWerePreviouslyClosed =
              !forcedClosedChildDialogsOpenButtons.length

            if (isUserEvent && noChildrenWerePreviouslyClosed) {
              moveToFront()
            }

            dialog()?.show()

            setState('show', true)

            props.onOpen?.()

            setTimeout(() => setState('open', true), 50)

            openForcedClosedChildDialogs(forcedClosedChildDialogsOpenButtons)
          } else {
            close()
          }
        }}
      />

      <Portal mount={dialogsDiv()}>
        <DialogBackdrop
          show={state.show && isModal()}
          open={state.open}
          zIndex={state.zIndex}
        />

        <Show when={state.moving}>
          <DialogLinesDefaultPosition
            top={defaultTop()}
            width={dialogWidth()}
            zIndex={state.zIndex}
          />
        </Show>

        {/* TODO: Use `Container` component here */}
        <dialog
          {...dialogProps}
          // TODO: Change to something else, won't trigger if animations are disabled by a user
          id={id()}
          onTransitionEnd={(event) => {
            if (event.target === dialog() && !state.open) {
              props.onCloseEnd?.()

              setState('show', false)

              dialog()?.close()
            }
          }}
          ref={(element) => setDialog(element)}
          onMouseDown={(event) => {
            event.stopPropagation()

            moveToFront()
          }}
          style={{
            ...(isWindowLarge() && !isAttached() && !isMaximized()
              ? {
                  ...(state.dimensions.width
                    ? {
                        'max-width': `${state.dimensions.width}px`,
                      }
                    : {}),

                  ...(state.dimensions.height
                    ? {
                        height: '100%',
                        'max-height': `${state.dimensions.height}px`,
                      }
                    : {}),

                  left: `${Math.min(
                    state.position.left ?? defaultLeft(),
                    useWindowSize().width - dialogWidth()
                  )}px`,

                  top: `${state.position.top ?? defaultTop()}px`,
                }
              : {}),
            'z-index': state.zIndex,
          }}
          class={classPropToString([
            props.full && 'h-full',

            state.open && 'open:translate-x-0 open:opacity-100',

            props.moveable && 'md:shadow-xl md:drop-shadow-lg',

            props.attached
              ? 'absolute max-h-[40vh] min-w-[12rem] space-y-1.5 rounded-xl border-2' // TODO: Check how floating-ui does max-height
              : `${
                  isMaximized()
                    ? 'h-full max-h-full'
                    : 'bottom-0 top-auto mt-[5vh] max-h-[95vh] rounded-t-2xl border-t-2 md:mt-0 md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-2xl md:border-2'
                } fixed w-full max-w-full space-y-3`,

            (() => {
              switch (props.color) {
                case 'transparent':
                  return 'bg-transparent'
                default:
                  return `bg-white`
              }
            })(),

            // TODO: Duration 1ms is a bit hacky, find a different way to fully close the dialog than onTransitionEnd

            isMaximized() && 'top-0',

            // TODO: border-orange-300 around the focused dialog

            'm-0 overflow-hidden border-black/5 p-0 text-black opacity-0 transition duration-150 backdrop:bg-transparent open:flex motion-reduce:transform-none motion-reduce:transition-none',
          ])}
        >
          <div class="relative flex w-full">
            <div class="flex flex-1 flex-col space-y-3">
              <Show when={!isAttached()}>
                <DialogHeader
                  dialog={dialog()}
                  maximized={state.maximized}
                  maximizable={props.maximizable}
                  moveable={props.moveable}
                  closeable={props.closeable}
                  title={props.title}
                  defaultLeft={defaultLeft()}
                  defaultTop={defaultTop()}
                  close={close}
                  toggleMaximized={() => {
                    moveToFront()
                    setState('maximized', (maximized) => !maximized)
                  }}
                  setPosition={(position) => setState('position', position)}
                  setMoving={(moving) => setState('moving', moving)}
                />

                <DialogDivider class="!mt-0" color={props.color} />
              </Show>

              <Show when={props.sticky}>
                {props.sticky}
                <DialogDivider color={props.color} />
              </Show>

              <DialogBody
                color={props.color}
                isAttached={isAttached()}
                footer={props.footer}
                children={props.children}
                form={props.form}
              />

              <Show when={props.footer}>
                <DialogDivider class="!mt-0" color={props.color} />

                <div class="flex items-center px-4 pb-4">
                  <DialogForm close={close} children={props.footer} />
                </div>
              </Show>
            </div>

            <Show when={props.resizable && !state.maximized}>
              <DialogResizers
                dialog={dialog()}
                setDimensions={(dimensions) =>
                  setState('dimensions', dimensions)
                }
                setPosition={(position) => setState('position', position)}
              />
            </Show>
          </div>
        </dialog>
      </Portal>
    </div>
  )
}
