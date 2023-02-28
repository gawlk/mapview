export const createWatcherHandler = () => {
  const disposers: (() => void)[] = []

  return {
    add: (effect: Solid.EffectFunction<any>): Promise<() => void> =>
      new Promise((resolve) => {
        createRoot((dispose) => {
          createEffect(effect)
          disposers.push(dispose)
          resolve(dispose)
        })
      }),
    remove: (dispose: () => void): void => {
      let index: number | undefined

      disposers.some((disposer, _index) => {
        const found = disposer === dispose
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
