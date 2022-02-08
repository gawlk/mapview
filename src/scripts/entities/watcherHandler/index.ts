export const createWatcherHandler = (): WatcherHandler => {
  const stops: (() => void)[] = []

  return {
    add: (stop: () => void): (() => void) => {
      stops.push(stop)
      return stop
    },
    remove: (stop: () => void): void => {
      const index = stops.findIndex(stop)
      stops[index]()
      stops.splice(index, 1)
    },
    clean: () => {
      stops.forEach((stop) => {
        stop()
      })
      stops.splice(0, stops.length)
    },
  }
}
