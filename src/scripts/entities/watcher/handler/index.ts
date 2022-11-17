export const createWatcherHandler = (): WatcherHandler => {
  const stops: (() => void)[] = []

  return {
    add: (stop: () => void): (() => void) => {
      stops.push(stop)
      return stop
    },
    remove: (stop: () => void): void => {
      let index: number | undefined

      stops.some((_stop, _index) => {
        const found = stop === _stop
        found && (index = _index)
        return found
      })

      if (index !== undefined) {
        stops[index]()
        stops.splice(index, 1)
      }
    },
    clean: () => {
      stops.forEach((stop) => {
        stop()
      })

      stops.splice(0, stops.length)
    },
    stops,
  }
}
