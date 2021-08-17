import { Marker } from 'mapbox-gl'
import { shallowReactive, watch } from 'vue'

import { createIcon } from './icon'

export const createPoint = (
  number: number,
  coordinates: mapboxgl.LngLatLike,
  map: mapboxgl.Map,
  rawData: MathNumberObject = {},
  parametersData: MathNumberObject = {}
): Point => {
  const icon = createIcon()

  const marker = new Marker({
    element: icon.element,
  })
    .setLngLat(coordinates)
    .addTo(map)

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
  })

  let watchStopDisplayString: any

  const watchStopState = watch(
    () => point.state,
    () => {
      watchStopDisplayString = watchStopDisplayString?.()

      switch (point.state) {
        case 'number':
          point.icon.setText(String(point.number))
          break
        case 'value':
          watchStopDisplayString = watch(
            () => point.finalData[point.selectedData]?.displayString,
            (displayString: string | undefined) => {
              point.icon.setText(displayString || '')
            },
            {
              immediate: true,
            }
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

  return point
}
