import { makeEventListener } from '@solid-primitives/event-listener'
import { useMousePosition } from '@solid-primitives/mouse'

import { moveDialog } from './scripts'

import { classPropToString } from '/src/components'

import { DialogButtonClose } from './components/buttonClose'
import { DialogButtonMaximize } from './components/buttonMaximize'

import { activateSelectNone, deactivateSelectNone } from '../scripts'

interface Props {
  dialog?: HTMLDialogElement
  maximized: boolean
  title?: string
  maximizable?: boolean
  moveable?: boolean
  closeable?: boolean
  defaultLeft: number
  defaultTop: number
  close: (element?: HTMLElement) => void
  toggleMaximized: () => void
  setPosition: (position: DialogPosition) => void
  setMoving: (moving: boolean) => void
}

export const DialogHeader = (props: Props) => {
  const [state, setState] = createStore({
    moving: false,
  })

  const mousePosition = useMousePosition()

  makeEventListener(window, 'mouseup', () => setState('moving', false), {
    passive: true,
  })

  createEffect(
    on(
      () => state.moving,
      (moving) => {
        props.setMoving(moving)

        if (moving) {
          activateSelectNone()

          moveDialog(
            props.dialog,
            props.defaultLeft,
            props.defaultTop,
            mousePosition,
            props.setPosition,
          )
        } else {
          deactivateSelectNone()
        }
      },
    ),
  )

  return (
    <div
      onMouseDown={() =>
        !props.maximized && props.moveable && setState('moving', true)
      }
      onDblClick={() => props.toggleMaximized()}
      class={classPropToString([
        !props.maximized && props.moveable && 'md:cursor-move',
        'flex items-center px-4 pb-3 pt-4',
      ])}
    >
      <Show when={props.closeable}>
        <DialogButtonClose close={props.close} />
      </Show>

      <h2 class="flex-grow truncate text-center text-xl font-semibold">
        {props.title}
      </h2>

      <span
        class="min-w-0 flex-1 md:hidden"
        style={{
          'max-width': '2.75rem',
        }}
      />

      <DialogButtonMaximize
        show={props.maximizable || false}
        maximized={props.maximized}
        onClick={props.toggleMaximized}
      />
    </div>
  )
}
