import { type MousePositionInside } from '@solid-primitives/mouse'

const fixTransformAxisValue = (value: number, min: number, max: number) => {
  const snapRange = 10

  const capedValue = Math.min(Math.max(value, min), max)

  return Math.abs(capedValue) <= snapRange ? 0 : capedValue
}

export const moveDialog = (
  dialog: HTMLDialogElement | undefined,
  transform: DialogTransform,
  mousePosition: MousePositionInside,
  callback: (transform: DialogTransform) => void
) => {
  if (!dialog) return

  const { x: originMouseX, y: originMouseY } = mousePosition
  const { offsetTop, offsetHeight, offsetWidth } = dialog
  const { innerHeight, innerWidth } = window
  const { x: dialogX, y: dialogY } = transform

  createEffect(() => {
    const { x: currentMouseX, y: currentMouseY } = mousePosition

    const x = dialogX + currentMouseX - originMouseX
    const y = dialogY + currentMouseY - originMouseY

    const maxX = (innerWidth - offsetWidth) / 2
    const minX = -maxX

    const minY = -offsetTop
    const maxY = innerHeight - offsetHeight - offsetTop

    callback({
      x: fixTransformAxisValue(x, minX, maxX),
      y: fixTransformAxisValue(y, minY, maxY),
    })
  })
}
