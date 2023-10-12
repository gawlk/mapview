import { forceCloseChildDialogs } from './children'

export const createDialogCloseFunction =
  ({
    dialog,
    setOpen,
    setValue,
    setShow,
    onCloseEnd,
    forcedClosedChildDialogsOpenButtons,
  }: {
    dialog: Accessor<HTMLDialogElement | undefined>
    setValue: Setter<string>
    setOpen: Setter<boolean>
    setShow: Setter<boolean>
    onCloseEnd: Accessor<VoidFunction | undefined>
    forcedClosedChildDialogsOpenButtons: HTMLButtonElement[]
  }): DialogCloseFunction =>
  (element?: HTMLElement) => {
    forceCloseChildDialogs(dialog(), forcedClosedChildDialogsOpenButtons)

    setValue(String(element && 'value' in element ? element.value ?? '' : ''))

    setOpen(false)

    setTimeout(
      () => {
        onCloseEnd()?.()
        setShow(false)
        dialog()?.close()
      },
      ((dialog()?.computedStyleMap().get('transition-duration') as CSSUnitValue)
        ?.value || 0) * 1000,
    )
  }

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
