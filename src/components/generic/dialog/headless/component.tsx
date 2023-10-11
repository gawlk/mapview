import { createMediaQuery } from '@solid-primitives/media'
import {
  createElementSize,
  useWindowSize,
} from '@solid-primitives/resize-observer'
import defaultTailwindCSSTheme from 'tailwindcss/defaultTheme'

import {
  classPropToString,
  headlessDialogBooleanPropsKeysObject,
  removeProps,
} from '/src/components'
import { createASS } from '/src/scripts'

import { DialogBackdrop, DialogResizers, DialogSnapLines } from './components'
import {
  createDialogCloseFunction,
  createDialogOpenFunction,
  createMovingEffect,
  createOnCloseEffect,
  createRelativePositionEffect,
  createScrolledOutEffect,
  HIDDEN_CLOSE_BUTTON_CLASS,
  makeClickOutsideEventListener,
  moveToFront,
} from './scripts'

type Props = HeadlessDialogPropsWithHTMLAttributes

export const HeadlessDialog = (props: Props) => {
  const state = {
    show: createASS(false),
    open: createASS(false),
    maximized: createASS(false),
    value: createASS(''),
    position: {
      left: createASS(undefined),
      top: createASS(undefined),
    } as DialogPosition,
    dimensions: {
      width: createASS(undefined),
      height: createASS(undefined),
    } as DialogDimensions,
    zIndex: createASS(0),
    moving: createASS(false),
    dialog: createASS<HTMLDialogElement | undefined>(undefined),
    dialogsDiv: createASS<HTMLElement | undefined>(undefined),
    attached: {
      left: createASS(undefined),
      top: createASS(undefined),
      width: createASS(undefined),
    } as DialogAttached,
  }

  const dialogProps = removeProps(props, headlessDialogBooleanPropsKeysObject)

  const forcedClosedChildDialogsOpenButtons: HTMLButtonElement[] = []

  const isWindowLarge = createMediaQuery(
    `(min-width: ${defaultTailwindCSSTheme.screens.md})`,
  )
  const isAbsolute = createMemo(() => !!props.attach?.())
  const isFixed = createMemo(() => !isAbsolute())
  const isMaximized = createMemo(
    () => !isAbsolute() && (props.maximized || state.maximized()),
  )
  const isMoveable = createMemo(
    () => !isAbsolute() && !isMaximized() && !!props.moveable && !!props.handle,
  )
  const hasBackdrop = createMemo(() => props.backdrop && !isAbsolute())
  const isWindowed = createMemo(() => !isAbsolute() && !isMaximized())
  const isInteractive = createMemo(() => isWindowLarge() && isWindowed())
  const id = createMemo(
    () =>
      `dialog-${props.title?.toLowerCase().replaceAll(' ', '-')}-${Math.floor(
        Math.random() * 100000000,
      )}`,
  )
  const defaultLeft = createMemo(() =>
    state.show() ? (useWindowSize().width - dialogWidth()) / 2 : 0,
  )
  const defaultTop = createMemo(() => Math.round(useWindowSize().height / 10))

  const dialogDimensions = createElementSize(state.dialog)
  const dialogWidth = createMemo(
    () => (dialogDimensions.width && state.dialog()?.offsetWidth) || 0,
  )

  const open: DialogOpenFunction = createDialogOpenFunction({
    dialog: state.dialog,
    dialogsDiv: state.dialogsDiv,
    forcedClosedChildDialogsOpenButtons,
    onOpen: props.onOpen,
    open: state.open,
    showSetter: state.show.set,
    zIndexSetter: state.zIndex.set,
  })

  const close: DialogCloseFunction = createDialogCloseFunction({
    dialog: state.dialog,
    setOpen: state.open.set,
    setValue: state.value.set,
    setShow: state.show.set,
    onCloseEnd: () => props.onCloseEnd,
    forcedClosedChildDialogsOpenButtons,
  })

  const toggle: DialogToggleFunction = (isUserEvent) => {
    if (!state.open()) {
      open(isUserEvent)
    } else {
      close()
    }
  }

  const toggleMaximize: DialogToggleMaximizedFunction = () => {
    moveToFront(state.dialogsDiv, state.zIndex.set)
    state.maximized.set((b) => !b)
  }

  createEffect(() => state.dimensions.height.set(props.dimensions?.height))
  createEffect(() => state.dimensions.width.set(props.dimensions?.width))
  createEffect(() => state.position.left.set(props.position?.left))
  createEffect(() => state.position.top.set(props.position?.top))
  createEffect(() => props.onOpenCreated?.(open))
  createEffect(() => props.onCloseCreated?.(close))
  createEffect(() => props.onToggleCreated?.(toggle))
  createEffect(() => props.onToggleMaximizeCreated?.(toggleMaximize))
  createEffect(() => props.onIdCreated?.(id()))
  createEffect(() => props.onAbsolute?.(isAbsolute()))
  createEffect(() => props.onMaximized?.(isMaximized()))

  onMount(() => {
    state.dialogsDiv.set(document.getElementById('dialogs') || undefined)

    createEffect(() => {
      if (props.onClose) {
        createOnCloseEffect({
          onClose: props.onClose,
          open: state.open,
          value: state.value,
        })
      }
    })

    createRelativePositionEffect({
      dialog: state.dialog,
      attach: props.attach,
      setters: state.attached,
    })

    createScrolledOutEffect({
      attach: props.attach,
      open: state.open,
      close,
    })

    createEffect(() => {
      const attach = props.attach

      if (attach) {
        let clearClickEvent: (() => void) | undefined
        createEffect(() => {
          clearClickEvent?.()
          if (isAbsolute() && state.open()) {
            clearClickEvent = makeClickOutsideEventListener(
              state.dialog(),
              props.attach?.(),
              close,
            )
          }
        })
        onCleanup(() => {
          clearClickEvent?.()
        })
      }
    })

    createMovingEffect(
      state.dialog,
      () => props.handle?.(),
      isMoveable,
      state.moving,
      defaultLeft,
      defaultTop,
      state.position,
    )
  })

  return (
    <Portal mount={state.dialogsDiv()}>
      <DialogBackdrop
        show={() => state.show() && hasBackdrop()}
        open={state.open}
        zIndex={state.zIndex}
      />

      <Show when={state.moving()}>
        <DialogSnapLines
          top={defaultTop()}
          width={dialogWidth()}
          zIndex={state.zIndex()}
        />
      </Show>

      <Dynamic
        component={props.component || 'dialog'}
        {...dialogProps}
        ref={state.dialog.set}
        id={id()}
        onMouseDown={(event: MouseEvent) => {
          event.stopPropagation()
          moveToFront(state.dialogsDiv, state.zIndex.set)
        }}
        style={{
          margin: 0,
          position: isAbsolute() ? 'absolute' : 'fixed',
          height: props.full?.() || isMaximized() ? '100%' : undefined,
          width: isMaximized() ? '100%' : undefined,
          'max-height': isMaximized() ? '100%' : undefined,
          top: isMaximized() ? '0px' : undefined,
          display: state.show() ? 'flex' : undefined,
          'z-index': state.zIndex(),
          padding: 0,

          ...(isAbsolute()
            ? {
                top: `${state.attached.top()}px`,
                left: `${state.attached.left()}px`,
                width: `${state.attached.width()}px`,
              }
            : {}),

          ...(isInteractive()
            ? {
                top: `${state.position.top() ?? defaultTop()}px`,
                left: `${Math.min(
                  state.position.left() ?? defaultLeft(),
                  useWindowSize().width - dialogWidth(),
                )}px`,
                ...(state.dimensions.width()
                  ? {
                      'max-width': `${state.dimensions.width()}px`,
                    }
                  : {}),
                ...(state.dimensions.height()
                  ? {
                      height: '100%',
                      'max-height': `${state.dimensions.height()}px`,
                    }
                  : {}),
              }
            : {}),
        }}
        class={classPropToString([
          props.classes,
          state.open() && props.classesOpen,
          isMoveable() && props.classesMoveable,
          isAbsolute() && props.classesAbsolute,
          isFixed() && props.classesFixed,
          isWindowed() && props.classesWindowed,
          isMaximized() && props.classesMaximized,
        ])}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: '100%',
          }}
        >
          <div style={{ overflow: 'auto', width: '100%' }}>
            {props.children}
          </div>

          <button
            hidden
            class={HIDDEN_CLOSE_BUTTON_CLASS}
            onClick={() => close()}
          />

          <Show when={props.resizable && !state.maximized()}>
            <DialogResizers
              dialog={state.dialog}
              dimensions={state.dimensions}
              position={state.position}
            />
          </Show>
        </div>
      </Dynamic>
    </Portal>
  )
}
