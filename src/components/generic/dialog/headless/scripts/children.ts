import { HIDDEN_CLOSE_BUTTON_CLASS } from '.'

export const openForcedClosedChildDialogs = (
  forcedClosedChildDialogsOpenButtons: HTMLButtonElement[],
) =>
  forcedClosedChildDialogsOpenButtons
    .splice(0)
    .forEach((button) => button.click())

export const forceCloseChildDialogs = (
  dialog: HTMLDialogElement | undefined,
  forcedClosedChildDialogsOpenButtons: HTMLButtonElement[],
) =>
  Array.from(document.getElementsByTagName('dialog'))
    .filter((_dialog) => _dialog.open && _dialog !== dialog)
    .forEach((_dialog) => {
      const _id = _dialog.id

      if (!dialog) return

      const elementsWithFor = [...dialog.querySelectorAll('[for]')]

      const openButton = elementsWithFor.find(
        (elementWithFor) => elementWithFor.getAttribute('for') === _id,
      ) as HTMLButtonElement | undefined

      if (openButton) {
        forcedClosedChildDialogsOpenButtons.push(openButton)

        const hiddenCloseButtonSelector = `.${HIDDEN_CLOSE_BUTTON_CLASS}`

        const button = [
          ..._dialog.querySelectorAll(hiddenCloseButtonSelector),
        ].pop() as HTMLButtonElement | undefined

        button?.click()
      }
    })
