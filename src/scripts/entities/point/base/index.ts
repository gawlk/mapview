import { Marker } from 'mapbox-gl'

import { createIcon, createWatcherHandler } from '/src/scripts'

interface BasePointCreatorParameters extends MachinePointCreatorParameters {
  machine: MachineName
}

export const createBasePointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
  parameters: BasePointCreatorParameters
): MachinePoint => {
  console.log('create point')

  const icon = createIcon(parameters.iconName)

  const marker = new Marker({
    element: icon.element,
    draggable: !parameters.projectMapviewSettings.arePointsLocked,
  }).setLngLat(json.coordinates)

  const watcherHandler = createWatcherHandler()

  const point = shallowReactive({
    machine: parameters.machine,
    number: parameters.number,
    // coord: json.coordinates,
    marker,
    icon,
    mapviewSettings: reactive(json.mapviewSettings),
    // rawData,
    // parametersData,
    // finalData: shallowReactive({}) as MathNumberObject,
    // selectedData: '',
    refreshVisibility: function () {
      if (
        parameters.projectMapviewSettings.arePointsVisible &&
        parameters.reportMapviewSettings.isVisible &&
        this.mapviewSettings.isVisible
      ) {
        this.marker.addTo(map)
      } else {
        this.marker.remove()
      }
    },
    addToMap: function () {
      let watcherDisplayString: any

      // watcherHandler.add(
      //   watch(
      //     () => point.state,
      //     () => {
      //       if (watcherDisplayString) {
      //         watcherDisplayString = watcherHandler.remove(watcherDisplayString)
      //       }

      //       switch (point.state) {
      //         case 'number':
      //           point.icon.setText(String(point.number))
      //           break
      //         case 'value':
      //           watcherDisplayString = watcherHandler.add(
      //             watch(
      //               () =>
      //                 (point.finalData[point.selectedData] as MathNumber)
      //                   .displayString,
      //               (displayString: string | undefined) => {
      //                 point.icon.setText(displayString || '')
      //               },
      //               {
      //                 immediate: true,
      //               }
      //             )
      //           )
      //           break
      //         case 'nothing':
      //           point.icon.setText('')
      //           break
      //       }
      //     },
      //     {
      //       immediate: true,
      //     }
      //   )
      // )

      this.refreshVisibility()
    },
    remove: function () {
      this.marker.remove()
      watcherHandler.clean()
    },
  } as BasePoint)

  return point
}
