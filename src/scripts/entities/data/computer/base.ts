import { createWatcherHandler } from '/src/scripts'

export const createDataComputer = (parameters: {
  label?: DataLabel
  compute: DataCompute
}) => {
  const { label, compute } = parameters

  if (label) {
    const watcherHandler = createWatcherHandler()

    return createMutable<DataComputer>({
      label,
      init() {
        void watcherHandler.add(() => {
          this.label && compute(this.label)
        })
      },
      clean: () => {
        watcherHandler.clean()
      },
    })
  }

  return null
}
