// TODO: Add parameter to support directed check
export const getScrollableParent = (
  element: HTMLElement | null
): Window | HTMLElement | undefined => {
  if (!element) {
    return undefined
  }

  let parent = element.parentElement

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent)

    if (
      overflowY
        .split(' ')
        .every((value) => value === 'auto' || value === 'scroll') &&
      parent.offsetHeight !== parent.scrollHeight
    ) {
      return parent
    }

    parent = parent.parentElement
  }

  return window
}
