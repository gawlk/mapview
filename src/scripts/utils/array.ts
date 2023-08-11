export const moveIndexInCopiedArray = <T>(
  originalArray: T[],
  oldIndex: number,
  newIndex: number,
) => {
  let copiedArray = [...originalArray]

  const [movedElement] = copiedArray.splice(oldIndex, 1)

  copiedArray.splice(newIndex, 0, movedElement)

  return copiedArray
}
