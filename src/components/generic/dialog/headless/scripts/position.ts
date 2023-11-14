import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom'
import { createIntersectionObserver } from '@solid-primitives/intersection-observer'
import { useWindowSize } from '@solid-primitives/resize-observer'

export const createRelativePositionEffect = ({
  dialog: _dialog,
  attach: _attach,
  setters,
}: {
  dialog: Accessor<HTMLDialogElement | undefined>
  attach?: Accessor<HTMLElement | undefined>
  setters?: DialogAttached
}) =>
  createEffect(() => {
    const dialog = _dialog()
    const attach = _attach?.()

    if (!dialog || !attach) {
      return
    }

    const windowSize = useWindowSize()

    let cleanup: VoidFunction | undefined

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

            setters?.left.set(x)
            setters?.top.set(y)
            setters?.width.set(attach?.clientWidth)
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
