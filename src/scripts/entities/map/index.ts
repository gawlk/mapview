import { Map, Marker, NavigationControl } from 'mapbox-gl'

import store from '/src/store'

import { createSVGElement } from '/src/scripts'

import SVGUserCircle from '/src/assets/svg/custom/user-circle.svg?raw'

export const mapStyles = [
  'mapbox://styles/mapbox/streets-v11',
  'mapbox://styles/mapbox/satellite-v9',
  'mapbox://styles/mapbox/light-v9',
  'mapbox://styles/mapbox/dark-v9',
]

export const waitForMap = () =>
  new Promise<boolean>((resolve) => {
    const interval = setInterval(async () => {
      if (store.map?.isStyleLoaded()) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })

export const createMap = (container: string): mapboxgl.Map => {
  const map = new Map({
    container,
    style: navigator?.onLine
      ? mapStyles[store.projects.selected?.settings.map?.styleIndex || 0]
      : { version: 8, sources: {}, layers: [] },
    center: [2.419263, 48.621551], // [lng, lat]
    zoom: 2,
    preserveDrawingBuffer: true,
    accessToken:
      'pk.eyJ1Ijoia2dhd2xpayIsImEiOiJjam1nMHE0Z2kwaTMzM3FwYTc0eDd1N2g0In0.eAfnfMMVkmrAiwj5RdUKYw',
  }).addControl(new NavigationControl(), 'top-left')

  if (navigator?.onLine) {
    window.addEventListener(
      'online',
      () => {
        map.setStyle(
          mapStyles[store.projects.selected?.settings.map.styleIndex || 0]
        )
      },
      {
        once: true,
      }
    )
  }

  if (navigator?.geolocation) {
    const marker = new Marker({
      element: createSVGElement(SVGUserCircle),
    })
      .setLngLat([0, -90])
      .addTo(map)
    navigator.geolocation.watchPosition((position) => {
      marker.setLngLat({
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      })
    })
  }

  map.on('moveend', () => {
    if (store.projects.selected) {
      store.projects.selected.settings.map.coordinates = map.getCenter()
    }
  })

  map.on('zoomend', () => {
    if (store.projects.selected) {
      store.projects.selected.settings.map.zoom = map.getZoom()
    }
  })

  map.on('style.load', () => {
    console.log('map loaded')

    addDummyLayersToMap(map)

    store.projects.selected?.refreshLinesAndOverlays()
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
