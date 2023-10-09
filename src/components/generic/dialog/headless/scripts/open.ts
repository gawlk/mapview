import { openForcedClosedChildDialogs } from './children'
import { moveToFront } from './front'

export const createDialogOpenFunction =
  ({
    dialog,
    open,
    showSetter,
    forcedClosedChildDialogsOpenButtons,
    dialogsDiv,
    zIndexSetter,
    onOpen,
  }: {
    dialog: Accessor<HTMLDialogElement | undefined>
    open: ASS<boolean>
    showSetter: Setter<boolean>
    onOpen: (() => void) | undefined
    forcedClosedChildDialogsOpenButtons: HTMLButtonElement[]
    dialogsDiv: Accessor<HTMLElement | undefined>
    zIndexSetter: Setter<number>
  }): DialogOpenFunction =>
  (isUserEvent) => {
    if (open()) return

    const noChildrenWerePreviouslyClosed =
      !forcedClosedChildDialogsOpenButtons.length

    if (isUserEvent && noChildrenWerePreviouslyClosed) {
      moveToFront(dialogsDiv, zIndexSetter)
    }

    dialog()?.show()

    showSetter(true)

    onOpen?.()

    setTimeout(() => open.set(true), 50)

    openForcedClosedChildDialogs(forcedClosedChildDialogsOpenButtons)
  }
