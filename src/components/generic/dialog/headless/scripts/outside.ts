import { makeEventListener } from '@solid-primitives/event-listener'

export const makeClickOutsideEventListener = (
  dialog: HTMLDialogElement | undefined,
  attach: HTMLElement | undefined,
  close: VoidFunction,
) => {
  if (!dialog) {
    return
  }

  return makeEventListener(
    document.body,
    'click',
    (event) => {
      if (dialog) {
        const { pageX, pageY } = event
        const { top, right, bottom, left } = dialog.getBoundingClientRect()

        if (pageX < left || pageY < top || pageX > right || pageY > bottom) {
          let element = event.target as HTMLElement | null

          while (
            element &&
            element !== dialog &&
            element !== attach &&
            element !== document.body
          ) {
            element = element.parentElement
          }

          setTimeout(
            () => element !== dialog && element !== attach && close(),
            1,
          )
        }
      }
    },
    { passive: true },
  )
}
