export const distanceBetweenPoints = (
  firstPoint: SortablePoint,
  secondPoint: SortablePoint,
): number =>
  Math.sqrt(
    (firstPoint.x - secondPoint.x) ** 2 + (firstPoint.y - secondPoint.y) ** 2,
  )
