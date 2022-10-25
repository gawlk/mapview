interface Line {
  sortedPoints: MachinePoint[]
  readonly addToMap: () => void
  readonly update: () => void
  readonly remove: () => void
}
