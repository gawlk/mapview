import { forceCloseChildDialogs } from './children'

export const createDialogCloseFunction =
  ({
    dialog: _dialog,
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
    const dialog = _dialog()

    forceCloseChildDialogs(dialog, forcedClosedChildDialogsOpenButtons)

    setValue(String(element && 'value' in element ? element.value ?? '' : ''))

    setOpen(false)

    const transitionDurationStyle = dialog
      ? window.getComputedStyle(dialog).transitionDuration
      : undefined
    const transitionDuration = transitionDurationStyle
      ? Number(transitionDurationStyle.slice(0, -1)) * 1000
      : 1

    setTimeout(() => {
      onCloseEnd()?.()
      setShow(false)
      dialog?.close()
    }, transitionDuration)
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
