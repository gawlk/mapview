const selectNone = 'select-none'

export const activateSelectNone = () => document.body.classList.add(selectNone)

export const deactivateSelectNone = () =>
  document.body.classList.remove(selectNone)
