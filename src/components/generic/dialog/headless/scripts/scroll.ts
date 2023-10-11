import { createIntersectionObserver } from '@solid-primitives/intersection-observer'

export const createScrolledOutEffect = ({
  attach: _attach,
  open,
  close,
}: {
  attach?: Accessor<HTMLElement | undefined>
  open: Accessor<boolean>
  close: DialogCloseFunction
}) =>
  createEffect(() => {
    const attach = _attach?.()

    if (!attach) return

    const [elements] = createSignal([attach])
    createIntersectionObserver(
      elements,
      (entries) => {
        if (open() && !entries[0].isIntersecting) {
          close()
        }
      },
      {
        threshold: 0,
      },
    )
  })
