// TODO: Add parameter to support directed check
export const getScrollableParent = (
  element: HTMLElement | null
): Window | HTMLElement | undefined => {
  if (!element) {
    return undefined
  }

  let parent = element.parentElement

  while (parent) {
    const { overflow } = window.getComputedStyle(parent)

    if (
      overflow
        .split(' ')
        .every((value) => value === 'auto' || value === 'scroll')
    ) {
      return parent
    }

    parent = parent.parentElement
  }

  return window
}
