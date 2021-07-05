import { Marker, LngLatLike, Map } from 'mapbox-gl'

export const createPoint = (
  number: number,
  coordinates: LngLatLike,
  map: Map,
  rawData: AnyNumberObject = {},
  parametersData: AnyNumberObject = {}
): Point => {
  const mapboxPoint = new Marker().setLngLat(coordinates).addTo(map)

  return {
    number,
    initialCoords: coordinates,
    mapboxPoint,
    rawData,
    parametersData,
    finalData: {},
  }
}
