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

type PointsText = 'value' | 'number'

interface Project {
  name: string
  reports: Report[]
  selectedReport: Report | undefined
  images: string[]
  units: MathUnit[]
  database: Database | undefined
  pointsLinked: boolean
  pointsLocked: boolean
  pointsVisible: boolean
  pointsText: PointsText
  informations: Field[]
  configurations: Field[]
}

interface Field {
  name: string
  value: AnyType
}

type AnyType =
  | boolean
  | number
  | string
  | SlidableNumber
  | DateValue
  | LongString
  | SelectableString
  | SimpleNumber
  | MathNumber

type AnyNumber = number | SimpleNumber | MathNumber

type AnyNumberObject = { [key: string]: AnyNumber }

interface SlidableNumber {
  kind: 'slidableNumber'
  value: number
  step: number
  min: number
  max: number
}

interface DateValue {
  kind: 'date'
  value: string
}

interface LongString {
  kind: 'longString'
  value: string
}

interface SelectableString {
  kind: 'selectableString'
  value: string
  possibleValues: string[]
  strict: boolean
}

interface Database {
  machine: string
  version: number
}

interface Report {
  name: string
  images: string[]
  points: Point[]
  dataSettings: any
}

interface Point {
  number: number
  initialCoords: any
  mapboxPoint: any
  rawData: AnyNumberObject
  parametersData: AnyNumberObject
  finalData: AnyNumberObject
}

interface SimpleNumber {
  value: number
  unit: string
}

interface MathNumber {
  value: any
  unit: MathUnit
  displayString: string
  displayStringWithUnit: string
  toDisplayedValue: () => void
}

interface MathUnit {
  name: string
  currentUnit: string
  currentPrecision: number
  possibleSettings: [string, number][]
  possiblePrecisions: number[]
  locked: boolean
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
