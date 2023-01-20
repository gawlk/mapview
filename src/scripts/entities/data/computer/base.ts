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
      init: function () {
        watcherHandler.add(
          watchEffect(() => {
            console.log('effect', label)

            this.label && compute(this.label)
          })
        )
      },
      clean: () => {
        watcherHandler.clean()
      },
    })

    return computer
  } else {
    return null
  }
}
