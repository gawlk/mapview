export const moveIndexInCopiedArray = <T,>(
  originalArray: T[],
  oldIndex: number,
  newIndex: number,
) => {
  const copiedArray = [...originalArray]

  const [movedElement] = copiedArray.splice(oldIndex, 1)

  copiedArray.splice(newIndex, 0, movedElement)

  return copiedArray
}

export const isSorted = (arr: number[]) =>
  arr.every((v, i, a) => !i || a[i - 1] <= v)
