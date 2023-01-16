interface Line {
  sortedPoints: BasePoint[]
  readonly addToMap: () => void
  readonly update: () => void
  readonly remove: () => void
}
