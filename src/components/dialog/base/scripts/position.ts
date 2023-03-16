import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom'
import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { useWindowSize } from '@solid-primitives/resize-observer'

export const createPositionEffect = (
  dialog: HTMLDialogElement,
  buttonOpen: HTMLButtonElement
) => {
  const windowSize = useWindowSize()

  let cleanup: (() => void) | undefined

  createIntersectionObserver(
    [buttonOpen] as unknown as Solid.Accessor<Element[]>,
    ([buttonOpenEntry]) => {
      if (buttonOpenEntry?.isIntersecting) {
        createEffect(
          on(
            () => [windowSize.height, windowSize.width],
            () => {
              cleanup?.()

              if (window.getComputedStyle(dialog).position === 'absolute') {
                cleanup = autoUpdate(buttonOpen, dialog, () =>
                  computePosition(buttonOpen, dialog, {
                    middleware: [
                      offset(4),
                      flip(),
                      shift({
                        padding: 5,
                      }),
                    ],
                  }).then(({ x, y }) => {
                    Object.assign(dialog.style, {
                      left: `${x}px`,
                      top: `${y}px`,
                      width: `${buttonOpen?.clientWidth}px`,
                    })
                  })
                )
              }
            }
          )
        )
      }
    }
  )

  onCleanup(() => {
    cleanup?.()
  })
}
