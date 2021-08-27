import { Map, NavigationControl } from 'mapbox-gl'

export const stylesURLs = [
  'mapbox://styles/mapbox/streets-v11',
  'mapbox://styles/mapbox/satellite-v9',
  'mapbox://styles/mapbox/light-v9',
  'mapbox://styles/mapbox/dark-v9',
]

export const createMap = (container: string) => {
  const map = new Map({
    container, // container ID
    style: window.navigator.onLine
      ? stylesURLs[0]
      : { version: 8, sources: {}, layers: [] },
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    preserveDrawingBuffer: true,
    accessToken:
      'pk.eyJ1Ijoia2dhd2xpayIsImEiOiJjam1nMHE0Z2kwaTMzM3FwYTc0eDd1N2g0In0.eAfnfMMVkmrAiwj5RdUKYw',
  }).addControl(new NavigationControl(), 'top-left')

  if (!window.navigator.onLine) {
    window.addEventListener(
      'online',
      () => {
        map.setStyle(stylesURLs[0])
      },
      {
        once: true,
      }
    )
  }

  return map
}

export const addDummyLayersToMap = (map: mapboxgl.Map) => {
  map.addSource('empty', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  })

  map.addLayer({
    id: 'lines',
    type: 'symbol',
    source: 'empty',
  })

  map.addLayer(
    {
      id: 'images',
      type: 'symbol',
      source: 'empty',
    },
    'lines'
  )
}
