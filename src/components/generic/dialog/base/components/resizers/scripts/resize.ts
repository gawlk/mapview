import { type MousePositionInside } from '@solid-primitives/mouse'

export const resizeDialog = (
  dialog: HTMLDialogElement | undefined,
  mousePosition: MousePositionInside,
  transform: DialogTransform,
  direction: DialogResizeDirection,
  setDimensions: (dimensions: Partial<DialogDimensions>) => void,
  setTransform: (transform: Partial<DialogTransform>) => void
) => {
  if (!dialog) return

  const { height: dialogHeightWithBorder, width: dialogWidthWithBorder } =
    dialog.getBoundingClientRect()

  const {
    offsetTop: dialogOffsetTop,
    clientWidth: dialogWidth,
    clientHeight: dialogHeight,
  } = dialog

  const dialogBorderWidth = dialogWidthWithBorder - dialogWidth
  const dialogBorderHeight = dialogHeightWithBorder - dialogHeight

  const { innerHeight: windowHeight, innerWidth: windowWidth } = window

  let { x: originalMouseX, y: originalMouseY } = mousePosition
  originalMouseX = Math.max(Math.min(originalMouseX, windowWidth), 0)
  originalMouseY = Math.max(Math.min(originalMouseY, windowHeight), 0)

  let { x: originalTransformX, y: originalTransformY } = transform

  console.log(originalTransformX)

  createEffect(() => {
    const { offsetLeft: dialogOffsetLeft } = dialog

    let { x: currentMouseX, y: currentMouseY } = mousePosition

    currentMouseX = Math.max(Math.min(currentMouseX, windowWidth), 0)
    currentMouseY = Math.max(Math.min(currentMouseY, windowHeight), 0)

    const isAnyNorth =
      direction === 'n' || direction === 'ne' || direction === 'nw'

    const isAnyWest =
      direction === 'w' || direction === 'sw' || direction === 'nw'

    const isHorizontalOnly = direction === 'w' || direction === 'e'

    const isVerticalOnly = direction === 'n' || direction === 's'

    const widthIncrement = !isVerticalOnly
      ? (currentMouseX - originalMouseX) * (isAnyWest ? -1 : 1)
      : 0

    const heightIncrement = !isHorizontalOnly
      ? (currentMouseY - originalMouseY) * (isAnyNorth ? -1 : 1)
      : 0

    const transformX =
      originalTransformX +
      Math.floor((widthIncrement * (isAnyWest ? -1 : 1)) / 2)

    // const transformY = originalTransformY - (isAnyNorth ? heightIncrement : 0)

    // v1: const maxWidth = windowWidth - 2 * Math.abs(transformX)
    // v2: const maxWidth = windowWidth - dialogOffsetLeft - transformX
    // const maxHeight = windowHeight - dialogOffsetTop - transformY

    // console.log(transformX)

    // v1: const width = Math.min(dialogWidth + widthIncrement, maxWidth)
    // v2: const width = dialogWidth + widthIncrement - dialogBorderWidth
    const width = dialogWidthWithBorder + widthIncrement
    // const height = Math.min(dialogHeight + heightIncrement, maxHeight)

    // console.log('width', width)

    setTransform({
      // ...(width < maxWidth ? { x: transformX } : {}),
      x: transformX,
      // y: height !== maxHeight ? transformY : transform.y,
    })

    setDimensions({
      width,
      // height,
    })
  })
}
