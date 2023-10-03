export const expand = (
  dialog: HTMLDialogElement | undefined,
  direction: DialogResizeDirection,
  setDimensions: (dimensions: Partial<DialogDimensions>) => void,
  setPosition: (position: Partial<DialogPosition>) => void,
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

  const isAnyNorth = direction.includes('n')
  const isAnySouth = direction.includes('s')
  const isAnyWest = direction.includes('w')
  const isAnyEast = direction.includes('e')

  if (isAnyNorth) {
    setDimensions({
      height: dialogHeight + dialogOffsetTop,
    })

    setPosition({
      top: 0,
    })
  }

  if (isAnyWest) {
    setDimensions({
      width: dialogWidth + dialogOffsetLeft,
    })

    setPosition({
      left: 0,
    })
  }

  if (isAnySouth) {
    const height = windowHeight - dialogOffsetTop

    setDimensions({
      height,
    })

    setPosition({
      top: dialogOffsetTop,
    })
  }

  if (isAnyEast) {
    const width = windowWidth - dialogOffsetLeft

    setDimensions({
      width,
    })

    setPosition({
      left: dialogOffsetLeft,
    })
  }
}
