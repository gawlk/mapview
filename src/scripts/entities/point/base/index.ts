import { Marker } from 'mapbox-gl'

import { createIcon, createWatcherHandler } from '/src/scripts'

export const createBasePointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
  parameters: BasePointCreatorParameters
): MachinePoint => {
  console.log('create point')

  const icon = createIcon(parameters.iconName)

  const marker = new Marker({
    element: icon.element,
    draggable: !parameters.projectSettings.arePointsLocked,
  }).setLngLat(json.coordinates)

  const watcherHandler = createWatcherHandler()

  let watcherDisplayString: any

  const point = shallowReactive({
    machine: parameters.machine,
    number: parameters.number,
    // coord: json.coordinates,
    marker,
    icon,
    settings: reactive(json.settings),
    // rawData,
    // parametersData,
    // finalData: shallowReactive({}) as MathNumberObject,
    // selectedData: '',
    updateText: function () {
      if (watcherDisplayString) {
        watcherDisplayString = watcherHandler.remove(watcherDisplayString)
      }

      switch (parameters.projectSettings.pointsState) {
        case 'number':
          this.icon.setText(String(point.number))
          break
        case 'value':
          // watcherDisplayString = watcherHandler.add(
          //   watch(
          //     () =>
          //       (this.finalData[this.selectedData] as MathNumber)
          //         .displayString,
          //     (displayString) => {
          //       this.icon.setText(displayString)
          //     },
          //     {
          //       immediate: true,
          //     }
          //   )
          // )
          break
        case 'nothing':
          this.icon.setText('')
          break
      }
    },
    updateVisibility: function () {
      if (
        parameters.projectSettings.arePointsVisible &&
        parameters.reportSettings.isVisible &&
        this.settings.isVisible
      ) {
        this.marker.addTo(map)
      } else {
        this.marker.remove()
      }
    },
    addToMap: function () {
      this.updateVisibility()
      this.updateText()
    },
    remove: function () {
      this.marker.remove()
      watcherHandler.clean()
    },
  } as BasePoint)

  return point
}
