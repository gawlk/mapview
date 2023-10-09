export const moveToFront = (
  dialogsDiv: Accessor<HTMLElement | undefined>,
  zIndexSetter: Setter<number>,
) => {
  const baseZIndex = 100

  const list = dialogsDiv()?.getElementsByTagName('dialog')

  const zIndexes = Array.from(list || [])
    .filter((_dialog) => _dialog.open)
    .map((_dialog) => (Number(_dialog.style.zIndex) || baseZIndex) - baseZIndex)

  const maxZIndex = zIndexes.length ? Math.max(...zIndexes) : 0

  zIndexSetter(baseZIndex + maxZIndex + 1)
}
