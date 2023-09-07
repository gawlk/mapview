export const createWatcherHandler = () => {
  const disposers: (() => void)[] = []

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    add: (effect: EffectFunction): Promise<() => void> =>
      new Promise((resolve) => {
        createRoot((dispose) => {
          createEffect(effect)
          disposers.push(dispose)
          resolve(dispose)
        })
      }),
    remove: (dispose: () => void) => {
      let index: number | undefined

      disposers.some((_dispose, _index) => {
        const found = _dispose === dispose
        found && (index = _index)
        return found
      })

      if (index !== undefined) {
        disposers[index]()
        disposers.splice(index, 1)
      }
    },
    clean: () => {
      disposers.forEach((dispose) => {
        dispose()
      })

      disposers.splice(0, disposers.length)
    },
    disposers,
  }
}
