import mapboxgl, {
  LngLatBounds,
  Map,
  Marker,
  NavigationControl,
} from 'mapbox-gl'

import store from '/src/store'

import { createSVGElement } from '/src/scripts'

import SVGUserCircle from '/src/assets/svg/custom/user-circle.svg?raw'

export const mapStyles = [
  'mapbox://styles/mapbox/streets-v12',
  'mapbox://styles/mapbox/outdoors-v12',
  'mapbox://styles/mapbox/satellite-streets-v12',
  'mapbox://styles/mapbox/light-v11',
  'mapbox://styles/mapbox/dark-v11',
]

export const waitForMap = () =>
  new Promise<boolean>((resolve) => {
    const interval = setInterval(async () => {
      if (!store.map || store.map?.isStyleLoaded()) {
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
    accessToken: import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN,
    antialias: true,
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

  map.on('pitchend', () => {
    if (store.projects.selected) {
      store.projects.selected.settings.map.pitch = map.getPitch()
    }
  })

  map.on('rotateend', () => {
    if (store.projects.selected) {
      store.projects.selected.settings.map.rotation = map.getBearing()
    }
  })

  map.on('style.load', () => {
    addDummyLayersToMap(map)

    add3DTerrainToMap(map)

    addBuildingsToMap(map)

    store.projects.selected?.refreshLinesAndOverlays()
  })

  return map
}

const addDummyLayersToMap = (map: mapboxgl.Map) => {
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

const add3DTerrainToMap = (map: mapboxgl.Map) => {
  map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14,
  })

  map.setTerrain({ source: 'mapbox-dem', exaggeration: 0.5 })
}

const addBuildingsToMap = (map: mapboxgl.Map) => {
  const layers = map.getStyle().layers

  const labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
  )?.id

  map.addLayer(
    {
      id: 'add-3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#999',

        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height'],
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.2,
      },
    },
    labelLayerId
  )
}

export const flyToPoints = (
  map: mapboxgl.Map | null | undefined,
  points: BasePoint[]
): void => {
  if (!map) return

  const bounds = new LngLatBounds()

  points.forEach((point) => {
    if (point.settings.isVisible && point.marker) {
      bounds.extend(point.marker.getLngLat())
    }
  })

  const generatePadding = (higher: number, lower: number) =>
    Math.max((higher - lower) / 4, 0.0001)

  const horizontalPadding = generatePadding(bounds.getEast(), bounds.getWest())

  const verticalPadding = generatePadding(bounds.getNorth(), bounds.getSouth())

  const sw = {
    lat: bounds.getSouth() - verticalPadding,
    lng: bounds.getWest() + horizontalPadding,
  }

  const ne = {
    lat: bounds.getNorth() + verticalPadding,
    lng: bounds.getEast() - horizontalPadding,
  }

  map?.fitBounds(new LngLatBounds(sw, ne))
}
