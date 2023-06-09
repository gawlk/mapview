import { useWindowSize } from '@solid-primitives/resize-observer'

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

const md = 768 // Number of pixel for the tailwind's "md" media query to trigger
const top = '10vh'
const minWidth = '20rem'

export default (props: Props) => {
  const [state, setState] = createStore({
    show: false,
    open: false,
    maximized: false,
    value: '',
    transform: {
      x: 0,
      y: 0,
    } as DialogTransform,
    dimensions: {
      width: undefined,
      height: undefined,
    } as DialogDimensions,
    zIndex: 0,
    moving: false,
  })

  const dialogProps = removeProps(props, dialogBooleanPropsKeysObject)

  const isWindowLarge = createMemo(() => useWindowSize().width >= md)
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

  // TODO: On window resize hide dialog if open button isn't visible on screen (hidden by parent for example)

  let dialog: HTMLDialogElement | undefined
  let buttonOpen: HTMLButtonElement | undefined
  const forcedClosedChildDialogsOpenButtons: HTMLButtonElement[] = []

  const [dialogsDiv, setDialogsDiv] = createSignal<HTMLElement | undefined>(
    undefined
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
    forceCloseChildDialogs(dialog, forcedClosedChildDialogsOpenButtons)

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
      if (isAttached() && dialog && buttonOpen) {
        createRelativePositionEffect(dialog, buttonOpen)
      }
    })

    let clearClickEvent: (() => void) | undefined
    createEffect(() => {
      clearClickEvent?.()
      if (isAttached() && state.open && dialog) {
        clearClickEvent = makeClickOutsideEventListener(dialog, close)
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

            dialog?.show()

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

        <DialogLinesDefaultPosition
          isMoving={state.moving}
          top={top}
          minWidth={minWidth}
          width={state.dimensions.width}
          zIndex={state.zIndex}
        />

        {/* TODO: Use `Container` component here */}
        <dialog
          {...dialogProps}
          // TODO: Change to something else, won't trigger if animations are disabled by a user
          id={id()}
          onTransitionEnd={(event) => {
            if (event.target === dialog && !state.open) {
              props.onCloseEnd?.()

              setState('show', false)

              dialog.close()
            }
          }}
          ref={dialog}
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
                        'min-width': minWidth,
                        'min-height': '5rem',
                      }
                    : {}),

                  ...(state.dimensions.height
                    ? {
                        height: '100%',
                        'max-height': `${state.dimensions.height}px`,
                      }
                    : {}),

                  // TODO: Changes to 16 to 1rem
                  transform: `translate(${state.transform.x}px, ${
                    state.transform.y + (!state.open ? 16 : 0)
                  }px)`,

                  top,
                }
              : {}),
            'z-index': state.zIndex,
          }}
          class={classPropToString([
            props.full && 'h-full',

            state.open && 'open:translate-x-0 open:opacity-100',

            props.moveable && 'md:shadow-xl',

            props.attached
              ? 'absolute m-0 max-h-[40vh] min-w-[12rem] space-y-1.5 rounded-xl border-2' // TODO: Check how floating-ui does max-height
              : `${
                  isMaximized()
                    ? 'h-full max-h-full'
                    : 'bottom-0 top-auto mt-[5vh] max-h-[95vh] rounded-t-2xl border-t-2 md:mt-0 md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-2xl md:border-2'
                } peer fixed w-full max-w-full space-y-3`,

            (() => {
              switch (props.color) {
                case 'transparent':
                  return 'bg-transparent'
                default:
                  return `bg-white`
              }
            })(),

            // TODO: Duration 1ms is a bit hacky, find a different way to fully close the dialog than onTransitionEnd
            // TODO: Should not be needed after changing to absolute
            // !isResizing()
            //   ? state.action || state.maximized
            //     ? 'duration-[1ms]'
            //     : 'duration-150'
            //   : 'duration-0',

            // TODO: To enable on resize or move
            // !!state.action && 'select-none',

            isMaximized() && 'top-0',

            'overflow-hidden border-black/5 p-0 text-black opacity-0 transition duration-150  backdrop:bg-transparent open:flex motion-reduce:transform-none motion-reduce:transition-none',
          ])}
        >
          <div class="relative flex w-full">
            <div class="flex flex-1 flex-col space-y-3">
              <Show when={!isAttached()}>
                <DialogHeader
                  dialog={dialog}
                  maximized={state.maximized}
                  maximizable={props.maximizable}
                  moveable={props.moveable}
                  closeable={props.closeable}
                  title={props.title}
                  transform={state.transform}
                  close={close}
                  toggleMaximized={() => {
                    moveToFront()
                    setState('maximized', (maximized) => !maximized)
                  }}
                  setTransform={(transform) => setState('transform', transform)}
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

            <Show when={props.resizable}>
              <DialogResizers
                dialog={dialog}
                transform={state.transform}
                setMoving={(moving) => setState('moving', moving)}
                setDimensions={(dimensions) =>
                  setState('dimensions', dimensions)
                }
                setTransform={(transform) => setState('transform', transform)}
              />
            </Show>
          </div>
        </dialog>
      </Portal>
    </div>
  )
}
