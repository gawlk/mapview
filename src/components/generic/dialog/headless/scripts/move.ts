import { makeEventListener } from '@solid-primitives/event-listener'
import {
  useMousePosition,
  type MousePositionInside,
} from '@solid-primitives/mouse'

import { clamp } from '/src/scripts'

import { activateUserSelectNone, deactivateUserSelectNone } from './userSelect'

export const createMovingEffect = (
  dialog: Accessor<HTMLDialogElement | undefined>,
  handle: Accessor<HTMLElement | undefined>,
  isMoveable: Accessor<boolean>,
  moving: ASS<boolean>,
  defaultLeft: Accessor<number>,
  defaultTop: Accessor<number>,
  position: DialogPosition,
) =>
  createEffect(
    on(handle, (_handle) => {
      if (!_handle || !isMoveable()) return

      const mousePosition = useMousePosition()

      makeEventListener(_handle, 'mousedown', () => {
        activateUserSelectNone(dialog())
        moving.set(true)
      })

      makeEventListener(window, 'mouseup', () => {
        deactivateUserSelectNone(dialog())
        moving.set(false)
      })

      createEffect(
        on(
          moving,
          (_moving) =>
            _moving &&
            moveDialog(
              dialog(),
              defaultLeft(),
              defaultTop(),
              mousePosition,
              position,
            ),
        ),
      )
    }),
  )

const moveDialog = (
  dialog: HTMLDialogElement | undefined,
  defaultLeft: number,
  defaultTop: number,
  mousePosition: MousePositionInside,
  position: DialogPosition,
) => {
  if (!dialog) return

  const { x: originMouseX, y: originMouseY } = mousePosition
  const {
    offsetTop: dialogOffsetTop,
    offsetLeft: dialogOffsetLeft,
    offsetHeight: dialogHeight,
    offsetWidth: dialogWidth,
  } = dialog
  const { innerHeight: windowHeight, innerWidth: windowWidth } = window

  createEffect(() => {
    const { x: currentMouseX, y: currentMouseY } = mousePosition

    const left = dialogOffsetLeft + currentMouseX - originMouseX
    const top = dialogOffsetTop + currentMouseY - originMouseY

    const maxX = windowWidth - dialogWidth
    const minX = 0

    const maxY = windowHeight - dialogHeight
    const minY = 0

    position.left.set(snap(clamp(left, minX, maxX), defaultLeft))
    position.top.set(snap(clamp(top, minY, maxY), defaultTop))
  })
}

const snap = (value: number, defaultValue: number) => {
  const snapRange = 10

  return Math.abs(value - defaultValue) <= snapRange ? undefined : value
}
