const scrollAmount = 5

export const scrollEffectCallback = (
  scrollableParent: HTMLElement | Window | undefined,
  directParent: HTMLElement | null,
  orientation: 'horizontal' | 'vertical' | 'both',
  mouseX: number,
  mouseY: number,
  increaseMouseX: (inc: number) => void,
  increaseMouseY: (inc: number) => void
) => {
  if (!scrollableParent || !directParent) return

  const { scrollX: windowScrollX, scrollY: windowScrollY } = window

  const {
    top: scrollableTop,
    left: scrollableLeft,
    right: scrollableRight,
    width: scrollableWidth,
    bottom: scrollableBottom,
    height: scrollableHeight,
  } = 'getBoundingClientRect' in scrollableParent
    ? scrollableParent.getBoundingClientRect()
    : {
        top: 0,
        bottom: window.innerHeight,
        height: window.innerHeight,
        left: 0,
        right: window.innerWidth,
        width: window.innerWidth,
      }

  const pad = scrollableHeight / 10

  const {
    bottom: parentBottom,
    top: parentTop,
    left: parentLeft,
    right: parentRight,
  } = directParent.getBoundingClientRect()

  if (orientation === 'horizontal' || orientation === 'both') {
    increaseMouseX(
      processScroll(
        scrollableParent,
        'horizontal',
        mouseX,
        scrollableLeft,
        scrollableRight,
        parentLeft,
        parentRight,
        windowScrollX,
        scrollableWidth,
        pad
      )
    )
  }

  if (orientation === 'vertical' || orientation === 'both') {
    increaseMouseY(
      processScroll(
        scrollableParent,
        'vertical',
        mouseY,
        scrollableTop,
        scrollableBottom,
        parentTop,
        parentBottom,
        windowScrollY,
        scrollableHeight,
        pad
      )
    )
  }
}

const processScroll = (
  scrollableParent: HTMLElement | Window,
  orientation: 'vertical' | 'horizontal',
  mouseXOrY: number,
  scrollableTopOrLeft: number,
  scrollableBottomOrRight: number,
  parentTopOrLeft: number,
  parentBottomOrRight: number,
  windowScrollXOrY: number,
  scrollableHeightOrWidth: number,
  pad: number
) => {
  if (
    scrollableBottomOrRight - pad < parentBottomOrRight &&
    mouseXOrY - scrollableTopOrLeft - windowScrollXOrY >
      scrollableHeightOrWidth - pad
  ) {
    return scroll(scrollableParent, orientation, 1)
  } else if (
    scrollableTopOrLeft + pad > parentTopOrLeft &&
    mouseXOrY - windowScrollXOrY < scrollableTopOrLeft + pad
  ) {
    return scroll(scrollableParent, orientation, -1)
  }
  return 0
}

const scroll = (
  scrollableParent: HTMLElement | Window,
  orientation: 'horizontal' | 'vertical',
  signum: -1 | 1
) => {
  const quantity = signum * scrollAmount

  orientation === 'vertical'
    ? scrollableParent.scrollBy(0, quantity)
    : scrollableParent.scrollBy(quantity, 0)

  return quantity
}
