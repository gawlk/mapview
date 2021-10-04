import { Map, Marker, NavigationControl } from 'mapbox-gl'

import { createSVGElement } from '/src/scripts'
import store from '/src/store'

import SVGUserCircle from '/src/assets/svg/custom/user-circle.svg?raw'

export const mapStyles = [
  'mapbox://styles/mapbox/streets-v11',
  'mapbox://styles/mapbox/satellite-v9',
  'mapbox://styles/mapbox/light-v9',
  'mapbox://styles/mapbox/dark-v9',
]

export const createMap = (container: string): mapboxgl.Map => {
  const map = new Map({
    container,
    style: window.navigator.onLine
      ? store.mapStyle
      : { version: 8, sources: {}, layers: [] },
    center: [2.419263, 48.621551], // [lng, lat]
    zoom: 2,
    preserveDrawingBuffer: true,
    accessToken:
      'pk.eyJ1Ijoia2dhd2xpayIsImEiOiJjam1nMHE0Z2kwaTMzM3FwYTc0eDd1N2g0In0.eAfnfMMVkmrAiwj5RdUKYw',
  }).addControl(new NavigationControl(), 'top-left')

  if (!window.navigator.onLine) {
    window.addEventListener(
      'online',
      () => {
        map.setStyle(store.mapStyle)
      },
      {
        once: true,
      }
    )
  }

  if (navigator.geolocation) {
    const marker = new Marker({
      element: createSVGElement(SVGUserCircle),
    })
      .setLngLat([0, -90])
      .addTo(map)

    navigator.geolocation.watchPosition((position) => {
      marker.setLngLat({
        lon: position.coords.longitude,
        lat: position.coords.latitude,
      })
    })
  }

  map.on('style.load', () => {
    console.log('map: loaded')

    addDummyLayersToMap(map)

    if (store.project?.mapviewSettings.arePointsLinked) {
      store.project.reports.forEach((report) => {
        report.line.addToMap()
      })
    }

    store.project?.images.forEach((image) => {
      store.project &&
        image.addToMap(store.project.mapviewSettings.areImagesVisible)
    })
  })

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
