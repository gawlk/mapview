import mapbox from 'mapbox-gl'

export const createPoint = (number: number, coordinates: mapbox.LngLatLike) => {
  const mapboxPoint = new mapbox.Marker().setLngLat(coordinates)

  return {
    number,
    initialCoords: coordinates,
    mapboxPoint,
    rawData: [],
    parametersData: [],
    finalData: [],
  }
}
