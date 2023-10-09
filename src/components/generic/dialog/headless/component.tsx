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
  createDialogOpenFunction,
  createMovingEffect,
  createOnCloseEffect,
  createRelativePositionEffect,
  createScrolledOutEffect,
  forceCloseChildDialogs,
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
  }

  const dialogProps = removeProps(props, headlessDialogBooleanPropsKeysObject)

  const forcedClosedChildDialogsOpenButtons: HTMLButtonElement[] = []

  const isWindowLarge = createMediaQuery(
    `(min-width: ${defaultTailwindCSSTheme.screens.md})`,
  )
  const isAttached = createMemo(() => !!props.attach)
  const isMaximized = createMemo(
    () => !isAttached() && (props.maximized || state.maximized()),
  )
  const isMoveable = createMemo(
    () => !isAttached() && !isMaximized() && !!props.moveable && !!props.handle,
  )
  const hasBackdrop = createMemo(
    () =>
      props.backdrop && !isAttached() && (props.moveable || props.resizable),
  )
  const isWindowed = createMemo(
    () => isWindowLarge() && !isAttached() && !isMaximized(),
  )
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

  const close: DialogCloseFunction = (element?: HTMLElement) => {
    forceCloseChildDialogs(state.dialog(), forcedClosedChildDialogsOpenButtons)

    state.value.set(
      String(element && 'value' in element ? element.value ?? '' : ''),
    )

    state.open.set(false)
  }

  const toggle: DialogToggleFunction = (isUserEvent) => {
    if (!state.open()) {
      open(isUserEvent)
    } else {
      close()
    }
  }

  const toggleMaximize: DialogToggleMaximizedFunction = () => {
    console.log('toggle max')
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
  createEffect(() => {
    console.log('wekfopw')
    props.onToggleMaximizeCreated?.(toggleMaximize)
  })
  createEffect(() => props.onIdCreated?.(id()))

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

    createRelativePositionEffect(state.dialog, props.attach)

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
          if (isAttached() && state.open()) {
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
        // TODO: Change to something else, won't trigger if animations are disabled by a user
        onTransitionEnd={(event: TransitionEvent) => {
          if (event.target === state.dialog() && !state.open) {
            props.onCloseEnd?.()
            state.show.set(false)
            state.dialog()?.close()
          }
        }}
        onMouseDown={(event: MouseEvent) => {
          event.stopPropagation()
          moveToFront(state.dialogsDiv, state.zIndex.set)
        }}
        style={{
          margin: 0,
          position: isAttached() ? 'absolute' : 'fixed',
          height: props.full || isMaximized() ? '100%' : undefined,
          'max-height': isMaximized() ? '100%' : '95vh',
          top: isMaximized() ? '0px' : 'auto',
          display: state.show() ? 'flex' : undefined,
          'z-index': state.zIndex(),
          padding: 0,

          ...(isWindowed()
            ? {
                bottom: '0px',
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
          isAttached() && props.classesAttached,
          isWindowed() && props.classesWindowed,
        ])}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: '100%',
          }}
        >
          <div style={{ overflow: 'auto' }}>
            {'max: ' + (state.maximized() ? 'true' : 'false')}
            {props.children}
          </div>
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
