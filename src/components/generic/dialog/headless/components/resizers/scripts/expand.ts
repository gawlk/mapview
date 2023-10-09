import { computeDirection } from './direction'

export const expand = (
  dialog: HTMLDialogElement | undefined,
  direction: DialogResizeDirection,
  dimensions: DialogDimensions,
  position: DialogPosition,
) => {
  if (!dialog) {
    return
  }

  const { innerHeight: windowHeight, innerWidth: windowWidth } = window

  const {
    offsetTop: dialogOffsetTop,
    offsetLeft: dialogOffsetLeft,
    offsetWidth: dialogWidth,
    offsetHeight: dialogHeight,
  } = dialog

  const { isAnyNorth, isAnySouth, isAnyWest, isAnyEast } =
    computeDirection(direction)

  if (isAnyNorth) {
    dimensions.height.set(dialogHeight + dialogOffsetTop)
    position.top.set(0)
  }

  if (isAnyWest) {
    dimensions.width.set(dialogWidth + dialogOffsetLeft)
    position.left.set(0)
  }

  if (isAnySouth) {
    dimensions.height.set(windowHeight - dialogOffsetTop)
    position.top.set(dialogOffsetTop)
  }

  if (isAnyEast) {
    dimensions.width.set(windowWidth - dialogOffsetLeft)
    position.left.set(dialogOffsetLeft)
  }
}
