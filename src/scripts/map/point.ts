import { Marker } from 'mapbox-gl'
import { createIcon, icons } from './icon'

export const createPoint = (
  number: number,
  coordinates: mapboxgl.LngLatLike,
  map: mapboxgl.Map,
  rawData: MathNumberObject = {},
  parametersData: MathNumberObject = {}
): Point => {
  const icon = createIcon()

  icon.setText(String(number))

  const marker = new Marker({
    element: icon.element,
  })
    .setLngLat(coordinates)
    .addTo(map)

  return {
    number,
    initialCoords: coordinates,
    marker,
    icon,
    isVisible: true,
    rawData,
    parametersData,
    finalData: {},
  }
}
