export const distanceBetweenPoints = (
  firstPoint: SortablePoint,
  secondPoint: SortablePoint
): number =>
  Math.sqrt(
    Math.pow(firstPoint.x - secondPoint.x, 2) +
      Math.pow(firstPoint.y - secondPoint.y, 2)
  )
