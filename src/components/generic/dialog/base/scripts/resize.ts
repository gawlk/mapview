import { type MousePositionInside } from '@solid-primitives/mouse'

export const resize = (
  dialog: HTMLDialogElement,
  mousePosition: MousePositionInside,
  transform: DialogTransform,
  direction: DialogResizeDirection,
  setDimensions: (dimensions: DialogDimensions) => void,
  setTransform: (transform: DialogTransform) => void
) => {
  const { x: originMouseX, y: originMouseY } = mousePosition

  const { offsetTop, offsetHeight, offsetWidth } = dialog
  const { innerHeight, innerWidth } = window

  createEffect(() => {
    const { x: currentMouseX, y: currentMouseY } = mousePosition

    const isAnyNorth =
      direction === 'n' || direction === 'ne' || direction === 'nw'

    const isAnyWest =
      direction === 'w' || direction === 'sw' || direction === 'nw'

    const isHorizontalOnly = direction === 'w' || direction === 'e'

    const isVerticalOnly = direction === 'n' || direction === 's'

    const x = !isVerticalOnly
      ? (currentMouseX - originMouseX) * (isAnyWest ? -1 : 1)
      : 0

    const y = !isHorizontalOnly
      ? (currentMouseY - originMouseY) * (isAnyNorth ? -1 : 1)
      : 0

    const transformX = transform.x + Math.floor((x * (isAnyWest ? -1 : 1)) / 2)

    const transformY = transform.y - (isAnyNorth ? y : 0)

    setTransform({
      x: transformX,
      y: transformY,
    })

    const maxWidth = innerWidth - 2 * Math.abs(transformX)
    const maxHeight = innerHeight - offsetTop - transformY

    setDimensions({
      width: Math.min(offsetWidth + x, maxWidth),
      height: Math.min(offsetHeight + y, maxHeight),
    })
  })
}
