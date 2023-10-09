import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom'
import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { useWindowSize } from '@solid-primitives/resize-observer'

export const createRelativePositionEffect = (
  _dialog: Accessor<HTMLDialogElement | undefined>,
  _attach?: Accessor<HTMLElement>,
) =>
  createEffect(() => {
    const dialog = _dialog()
    const attach = _attach?.()

    if (!dialog || !attach) {
      return
    }

    const windowSize = useWindowSize()

    let cleanup: (() => void) | undefined

    const [isIntersecting, setIsIntersecting] = createSignal(false)

    createEffect(
      on([isIntersecting, () => [windowSize.height, windowSize.width]], () => {
        cleanup?.()

        if (
          // TODO: Wait for a fix or fix it somehow
          // Portal breaks first intersection observer in Chrome
          // isIntersecting &&
          window.getComputedStyle(dialog).position === 'absolute' // Checking again for mobile iirc ?
        ) {
          cleanup = autoUpdate(attach, dialog, async () => {
            const { x, y } = await computePosition(attach, dialog, {
              middleware: [
                offset(4),
                flip(),
                shift({
                  padding: 5,
                }),
              ],
            })

            Object.assign(dialog.style, {
              left: `${x}px`,
              top: `${y}px`,
              width: `${attach?.clientWidth}px`,
            })
          })
        }
      }),
    )

    createIntersectionObserver(
      () => [attach],
      ([entry]) => setIsIntersecting(entry?.isIntersecting ?? false),
    )

    onCleanup(() => {
      cleanup?.()
    })
  })
