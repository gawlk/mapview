/// <reference types="vite/client" />

// import { Source, Marker } from 'mapbox-gl'

interface LngLatCoord {
  lng: number
  lat: number
}

interface XYCoord {
  x: number
  y: number
}

interface ImageCoord {
  tl: XYCoord
  tr: XYCoord
  bl: XYCoord
  br: XYCoord
}

interface Project {
  name: string
  reports: Report[]
  images: string[]
  database: Database | undefined
  additionnalFields: any
}

interface Database {
  machine: string
  version: number
}

interface Report {
  name: string
  images: string[]
}

interface ImageMap {
  id: string
  source: any
  markerNW: any
  markerSE: any
}

interface Store {
  project: Project | undefined
  selectedReport: Report | undefined
  map: any
  save: (key: string, value: string) => void
}
