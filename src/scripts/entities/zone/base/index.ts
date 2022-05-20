import { createWatcherHandler, sortPoints } from '/src/scripts'

export const createBaseZoneFromJSON = (
  json: JSONZone,
  parameters: BaseZoneCreatorParameters
): BaseZone => {
  const watcherHandler = createWatcherHandler()

  return shallowReactive({
    machine: parameters.machine,
    name: json.name,
    points: shallowReactive([] as MachinePoint[]),
    settings: shallowReactive(json.settings),
    report: parameters.report,
    init: function () {
      this.points.forEach((point) => point.addToMap())

      watcherHandler.add(
        watch(
          () => this.points.length,
          () => {
            sortPoints(this.points)
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.color,
          () => {
            this.points.forEach((point) => point.updateColor())
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.isVisible,
          () => {
            this.points.forEach((point) => {
              point.updateVisibility()
            })
            this.report.line.update()
          }
        )
      )
    },
    clean: function () {
      watcherHandler.clean()

      this.points.forEach((point) => {
        point.remove()
      })
    },
  })
}
