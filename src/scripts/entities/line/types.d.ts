interface ComputedRef<T> {
  value: T
}

interface Line {
  readonly sortedPoints: ComputedRef<MachinePoint[]>
  addToMap: () => void
  update: () => void
  remove: () => void
}
