import { type MousePositionInside } from '@solid-primitives/mouse'

import { clamp } from '/src/scripts'

const snap = (value: number, defaultValue: number) => {
  const snapRange = 10

  return Math.abs(value - defaultValue) <= snapRange ? undefined : value
}

export const moveDialog = (
  dialog: HTMLDialogElement | undefined,
  defaultLeft: number,
  defaultTop: number,
  mousePosition: MousePositionInside,
  callback: (position: DialogPosition) => void,
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

    callback({
      left: snap(clamp(left, minX, maxX), defaultLeft),
      top: snap(clamp(top, minY, maxY), defaultTop),
    })
  })
}
