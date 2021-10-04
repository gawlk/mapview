import { Marker } from 'mapbox-gl'
import { shallowReactive, watch } from 'vue'

import { createIcon, createWatcherHandler } from '/src/scripts'

export const createBasePoint = (
  number: number,
  iconName: IconName,
  coordinates: mapboxgl.LngLatLike,
  map: mapboxgl.Map,
  rawData: MathNumberObject = {},
  parametersData: MathNumberObject = {}
): MachinePoint => {
  const icon = createIcon(iconName)

  const marker = new Marker({
    element: icon.element,
  })
    .setLngLat(coordinates)
    .addTo(map)

  const watcherHandler = createWatcherHandler()

  const point = shallowReactive({
    number,
    initialCoords: coordinates,
    marker,
    icon,
    isVisible: true,
    rawData,
    parametersData,
    finalData: shallowReactive({}) as MathNumberObject,
    selectedData: '',
    state: 'number' as PointState,
    clean: () => {
      marker.remove()
      watcherHandler.clean()
    },
  })

  let watcherDisplayString: any

  watcherHandler.add(
    watch(
      () => point.state,
      () => {
        if (watcherDisplayString) {
          watcherDisplayString = watcherHandler.remove(watcherDisplayString)
        }

        switch (point.state) {
          case 'number':
            point.icon.setText(String(point.number))
            break
          case 'value':
            watcherDisplayString = watcherHandler.add(
              watch(
                () =>
                  (point.finalData[point.selectedData] as MathNumber)
                    .displayString,
                (displayString: string | undefined) => {
                  point.icon.setText(displayString || '')
                },
                {
                  immediate: true,
                }
              )
            )
            break
          case 'nothing':
            point.icon.setText('')
            break
        }
      },
      {
        immediate: true,
      }
    )
  )

  return point
}
