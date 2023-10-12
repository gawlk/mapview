import { type MousePositionInside } from '@solid-primitives/mouse'

import { clamp } from '/src/scripts'

const minWidth = 320
const minHeight = 100

export const resizeDialog = (
  dialog: HTMLDialogElement | undefined,
  mousePosition: MousePositionInside,
  direction: DialogResizeDirection,
  dimensions: DialogDimensions,
  position: DialogPosition,
) => {
  if (!dialog) return

  const { innerHeight: windowHeight, innerWidth: windowWidth } = window

  const {
    offsetTop: dialogOffsetTop,
    offsetLeft: dialogOffsetLeft,
    offsetWidth: dialogWidth,
    offsetHeight: dialogHeight,
  } = dialog

  const dialogOffsetRight = windowWidth - dialogOffsetLeft - dialogWidth
  const dialogOffsetBottom = windowHeight - dialogOffsetTop - dialogHeight

  const isAnyNorth = direction.includes('n')
  const isAnyWest = direction.includes('w')

  const isHorizontalOnly = direction === 'w' || direction === 'e'
  const isVerticalOnly = direction === 'n' || direction === 's'

  const clampMouseX = (x: number) => clamp(x, 0, windowWidth)
  const clampMouseY = (y: number) => clamp(y, 0, windowHeight)

  const widthIncrementMultiplier = isAnyWest ? -1 : 1
  const heightIncrementMultiplier = isAnyNorth ? -1 : 1

  const dialogOffsetHorizontal = isAnyWest
    ? dialogOffsetLeft
    : dialogOffsetRight
  const dialogOffsetVertical = isAnyNorth ? dialogOffsetTop : dialogOffsetBottom

  const maxDialogOffsetTop = windowHeight - dialogOffsetBottom - minHeight
  const maxDialogOffsetLeft = windowWidth - dialogOffsetRight - minWidth

  let { x: originalMouseX, y: originalMouseY } = mousePosition
  originalMouseX = clampMouseX(originalMouseX)
  originalMouseY = clampMouseY(originalMouseY)

  createEffect(() => {
    let { x: currentMouseX, y: currentMouseY } = mousePosition
    currentMouseX = clampMouseX(currentMouseX)
    currentMouseY = clampMouseY(currentMouseY)

    const widthIncrement = Math.min(
      !isVerticalOnly
        ? (currentMouseX - originalMouseX) * widthIncrementMultiplier
        : 0,
      dialogOffsetHorizontal,
    )

    const heightIncrement = Math.min(
      !isHorizontalOnly
        ? (currentMouseY - originalMouseY) * heightIncrementMultiplier
        : 0,
      dialogOffsetVertical,
    )

    position.top.set(
      isAnyNorth
        ? Math.min(dialogOffsetTop - heightIncrement, maxDialogOffsetTop)
        : dialogOffsetTop,
    )

    position.left.set(
      isAnyWest
        ? Math.min(dialogOffsetLeft - widthIncrement, maxDialogOffsetLeft)
        : dialogOffsetLeft,
    )

    dimensions.width.set(Math.max(dialogWidth + widthIncrement, minWidth))

    dimensions.height.set(Math.max(dialogHeight + heightIncrement, minHeight))
  })
}
