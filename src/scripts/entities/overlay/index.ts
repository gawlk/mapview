import { Marker, type Map } from 'mapbox-gl'
import pica from 'pica'

import SVGRotate from '/src/assets/svg/custom/rotate.svg?raw'
import { env } from '/src/env'
import { createASS, createSVGElement, wcToWGS, wGStoWc } from '/src/scripts'
import { runWithOwner } from 'solid-js'
import { store } from '/src/store'

export const createOverlay = async (
  data64: string,
  map: Map | null,
  parameters: JSONOverlay,
  project: MachineProject,
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Promise<Overlay> => {
  const areOverlaysVisible = project.settings.areOverlaysVisible
  const owner = project.owner

  const id = `overlay-${parameters.name}-${+new Date() + Math.random()}`

  let width = 0
  let height = 0

  if (!env.isTest) {
    const imageElement = await getImageFromData64(data64)

    width = 500
    height = (width * imageElement.height) / imageElement.width

    const canvasTo = document.createElement('canvas')
    canvasTo.width = width
    canvasTo.height = height

    data64 = (await pica().resize(imageElement, canvasTo)).toDataURL()
  }

  return new Promise((resolve) => {
    runWithOwner(owner, () => {
      const { nw, se } = parameters.coordinates || initialiseNWAndSECoords(map)

      const sourceData: mapboxgl.ImageSourceRaw = {
        type: 'image',
        url: data64,
        coordinates: [
          [nw.lng, nw.lat],
          [se.lng, nw.lat],
          [se.lng, se.lat],
          [nw.lng, se.lat],
        ],
      }

      const markerNW = createMarker(map, nw)

      const markerSE = createMarker(map, se)

      const overlay: Overlay = {
        id,
        sourceData,
        markerNW,
        markerSE,
        opacity: createASS(parameters.opacity || 0.5),
        addToMap(): void {
          if (!map) return

          markerNW?.addTo(map)
          markerSE?.addTo(map)

          map.addSource(id, sourceData)

          map.addLayer(
            {
              id,
              source: id,
              type: 'raster',
              paint: {
                'raster-opacity': this.opacity(),
                'raster-fade-duration': 0,
              },
            },
            'images',
          )

          const source = map?.getSource(id) as mapboxgl.ImageSource | undefined

          if (markerNW && markerSE) {
            setImageCoordinates(markerNW, markerSE, source, width, height)

            const onMarkerDrag = () => {
              setImageCoordinates(markerNW, markerSE, source, width, height)
            }

            markerNW.on('drag', onMarkerDrag)
            markerSE.on('drag', onMarkerDrag)
          }
        },
        refresh() {
          if (areOverlaysVisible()) {
            untrack(() => {
              overlay.addToMap()
            })
          } else {
            untrack(() => {
              overlay.removeFromMap()
            })
          }
        },
        removeFromMap() {
          if (map) {
            map.getLayer(id) && map.removeLayer(id)
            map.getSource(id) && map.removeSource(id)
          }

          markerNW?.remove()
          markerSE?.remove()
        },
        toJSON(): JSONOverlay {
          return {
            version: 1,
            name: parameters.name,
            opacity: this.opacity(),
            coordinates: {
              nw: this.markerNW?.getLngLat() || nw,
              se: this.markerSE?.getLngLat() || se,
            },
          }
        },
      }

      createEffect(() => {
        map &&
          map.getLayer(id) &&
          map.setPaintProperty(id, 'raster-opacity', overlay.opacity())
      })

      createEffect(() => {
        if (project === store.selectedProject()) {
          overlay.refresh()
        }
      })

      resolve(overlay)
    })
  })
}

const initialiseNWAndSECoords = (
  map: mapboxgl.Map | null,
): {
  nw: LngLat
  se: LngLat
} => {
  if (!map) {
    return {
      nw: {
        lng: 0,
        lat: 0,
      },
      se: {
        lng: 0,
        lat: 0,
      },
    }
  }

  const center = map.getCenter()
  const bounds = map.getBounds()

  const nw = bounds.getNorthWest()
  const se = bounds.getSouthEast()

  nw.lng += (center.lng - nw.lng) / 2
  nw.lat -= (nw.lat - center.lat) / 2

  se.lng -= (se.lng - center.lng) / 2
  se.lat += (center.lat - se.lat) / 2

  return {
    nw,
    se,
  }
}

const getImageFromData64 = async (data64: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image()

    image.src = data64

    image.onload = () => {
      resolve(image)
    }
  })

const createMarker = (map: mapboxgl.Map | null, coordinates: LngLat) =>
  map
    ? new Marker({
        element: createSVGElement(SVGRotate),
      })
        .setLngLat(coordinates)
        .setDraggable(true)
    : null

const setImageCoordinates = (
  markerNW: mapboxgl.Marker,
  markerSE: mapboxgl.Marker,
  sourceImage: mapboxgl.ImageSource | undefined,
  imageWidth: number,
  imageHeight: number,
) => {
  const markerLngLatTL = markerNW.getLngLat()
  const markerLngLatBR = markerSE.getLngLat()

  const markerWCTL = wGStoWc(markerLngLatTL)
  const markerWCBR = wGStoWc(markerLngLatBR)

  const wCCoord = getImageCoordinates(
    markerWCTL,
    markerWCBR,
    imageHeight,
    imageWidth,
  )

  const markerWGSTL = wcToWGS(wCCoord.tl)
  const markerWGSTR = wcToWGS(wCCoord.tr)
  const markerWGSBL = wcToWGS(wCCoord.bl)
  const markerWGSBR = wcToWGS(wCCoord.br)

  const coordinates = [
    [markerWGSTL.lng, markerWGSTL.lat],
    [markerWGSBL.lng, markerWGSBL.lat],
    [markerWGSBR.lng, markerWGSBR.lat],
    [markerWGSTR.lng, markerWGSTR.lat],
  ]

  sourceImage?.setCoordinates(coordinates)
}

const getImageCoordinates = (
  markerTL: XYCoord,
  markerBR: XYCoord,
  imageWidth: number,
  imageHeight: number,
): ImageCoordinates => {
  const orTL: XYCoord = { x: -imageWidth / 2, y: +imageHeight / 2 }
  const orTR: XYCoord = { x: +imageWidth / 2, y: +imageHeight / 2 }
  const orBL: XYCoord = { x: -imageWidth / 2, y: -imageHeight / 2 }
  const orBR: XYCoord = { x: +imageWidth / 2, y: -imageHeight / 2 }

  const scale = scaleFactorBetweenOrFin(orTL, orBR, markerTL, markerBR)
  const angle = angleBetweenOrFin(orTL, orBR, markerTL, markerBR)
  const offet = offsetBetweenOrFin(orTL, orBR, markerTL, markerBR)

  return {
    tl: transformPoint(orTL, scale, angle, offet),
    tr: transformPoint(orTR, scale, angle, offet),
    bl: transformPoint(orBL, scale, angle, offet),
    br: transformPoint(orBR, scale, angle, offet),
  }
}

const scaleFactorBetweenOrFin = (
  orTL: XYCoord,
  orBR: XYCoord,
  finTL: XYCoord,
  finBR: XYCoord,
): number => {
  const lfin = cartesianDistance(finTL, finBR)
  const lor = cartesianDistance(orTL, orBR)
  return lfin / lor
}

const cartesianDistance = (pt1: XYCoord, pt2: XYCoord): number =>
  Math.sqrt(
    (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y),
  )

const getAngle = (a: XYCoord, b: XYCoord): number =>
  Math.atan2(b.y - a.y, b.x - a.x)

const angleBetweenOrFin = (
  orTL: XYCoord,
  orBR: XYCoord,
  finTL: XYCoord,
  finBR: XYCoord,
): number => {
  const o = getAngle(orTL, orBR)
  const f = getAngle(finTL, finBR)
  return f - o
}

const offsetBetweenOrFin = (
  orTL: XYCoord,
  orBR: XYCoord,
  finTL: XYCoord,
  finBR: XYCoord,
): XYCoord => {
  const midOr: XYCoord = {
    x: (orTL.x + orBR.x) / 2,
    y: (orTL.y + orBR.y) / 2,
  }
  const midfin: XYCoord = {
    x: (finTL.x + finBR.x) / 2,
    y: (finTL.y + finBR.y) / 2,
  }

  return {
    x: midfin.x - midOr.x,
    y: midfin.y - midOr.y,
  }
}

const scalePoint = (pt: XYCoord, scale: number): XYCoord => {
  return {
    x: pt.x * scale,
    y: pt.y * scale,
  }
}

const translatePoint = (pt: XYCoord, offset: XYCoord): XYCoord => {
  return {
    x: pt.x + offset.x,
    y: pt.y + offset.y,
  }
}

const rotatePoint = (pt: XYCoord, angle: number): XYCoord => {
  return {
    x: pt.x * Math.cos(angle) - pt.y * Math.sin(angle),
    y: pt.x * Math.sin(angle) + pt.y * Math.cos(angle),
  }
}

const transformPoint = (
  pt: XYCoord,
  scale: number,
  angle: number,
  offset: XYCoord,
): XYCoord => {
  let pttranform = pt
  pttranform = scalePoint(pttranform, scale)
  pttranform = rotatePoint(pttranform, angle)
  pttranform = translatePoint(pttranform, offset)
  return pttranform
}
