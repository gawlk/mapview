const property = 'user-select'

export const activateUserSelectNone = (dialog: HTMLDialogElement | undefined) =>
  dialog?.style.setProperty(property, 'none')

export const deactivateUserSelectNone = (
  dialog: HTMLDialogElement | undefined,
) => dialog?.style.setProperty(property, null)
