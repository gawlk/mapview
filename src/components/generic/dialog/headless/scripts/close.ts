export const createOnCloseEffect = ({
  open,
  value,
  onClose,
}: {
  open: Accessor<boolean>
  value: Accessor<string>
  onClose: ((value?: string | undefined) => void) | undefined
}) =>
  createEffect(
    on(open, (current, previous) => {
      if (!current && previous) {
        onClose?.(value() || undefined)
      }
    }),
  )
