interface WatcherHandler {
  add: (stop: () => void) => () => void
  remove: (stop: () => void) => void
  clean: () => void
  stops: (() => void)[]
}
