import { createWatcherHandler } from '/src/scripts'

export const createDataComputer = (parameters: {
  label?: DataLabel
  compute: DataCompute
}) => {
  const { label, compute } = parameters

  if (label) {
    const watcherHandler = createWatcherHandler()

    const computer: DataComputer = shallowReactive({
      label,
      async init() {
        watcherHandler.add(
          watchEffect(() => {
            this.label && compute(this.label)
          })
        )
      },
      clean: () => {
        watcherHandler.clean()
      },
    })

    return computer
  }

  return null
}
