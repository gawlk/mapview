import mapboxgl, { Marker } from 'mapbox-gl'

import {
  createSVGElement,
  createWatcherHandler,
  wGStoWc,
  wcToWGS,
} from '/src/scripts'

import SVGRotate from '/src/assets/svg/custom/rotate.svg?raw'

export const createImage = async (
  data64: string,
  map: mapboxgl.Map,
  parameters: JSONImage
): Promise<Image> => {
  const id = `image-${parameters.name}-${+new Date()}_${Math.random()}`

  const { width, height } = (await getImageDimensions(data64)) as {
    width: number
    height: number
  }

  const { nw, se } =
    parameters.coordinates || (await initialiseNWAndSECoords(map))

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

  const markerNW = createMarker(nw, map)

  const markerSE = createMarker(se, map)

  const watcherHandler = createWatcherHandler()

  const image = shallowReactive({
    id,
    sourceData,
    markerNW,
    markerSE,
    opacity: parameters.opacity || 0.5,
    addToMap(areImagesVisible: boolean): void {
      console.log('add image', id)

      if (areImagesVisible) {
        markerNW.addTo(map)
        markerSE.addTo(map)
      }

      map.addSource(id, sourceData)

      map.addLayer(
        {
          id,
          source: id,
          type: 'raster',
          paint: {
            'raster-opacity': areImagesVisible ? this.opacity : 0,
            'raster-fade-duration': 0,
          },
        },
        'images'
      )

      console.log('image layer', map.getLayer(id))

      const source = map.getSource(id) as mapboxgl.ImageSource

      console.log('image source', source)

      setImageCoordinates(markerNW, markerSE, source, width, height)

      const onMarkerDrag = () => {
        setImageCoordinates(markerNW, markerSE, source, width, height)
      }

      markerNW.on('drag', onMarkerDrag)
      markerSE.on('drag', onMarkerDrag)

      watcherHandler.add(
        watch(
          () => image.opacity,
          (opacity: number) => {
            map.setPaintProperty(id, 'raster-opacity', opacity)
          }
        )
      )
    },
    remove: (): void => {
      console.log('remove image', id)

      map.getLayer(id) && map.removeLayer(id)
      map.getSource(id) && map.removeSource(id)

      markerNW.remove()
      markerSE.remove()

      watcherHandler.clean()
    },
  })

  return image
}

const initialiseNWAndSECoords = async (
  map: mapboxgl.Map
): Promise<{
  nw: LngLat
  se: LngLat
}> => {
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

const getImageDimensions = async (data64: string) =>
  new Promise((resolve) => {
    const image = new Image()

    image.src = data64

    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      })
    }
  })

const createMarker = (coordinates: LngLat, map: mapboxgl.Map) =>
  new Marker({
    element: createSVGElement(SVGRotate),
  })
    .setLngLat(coordinates)
    .setDraggable(true)

const setImageCoordinates = (
  markerNW: mapboxgl.Marker,
  markerSE: mapboxgl.Marker,
  sourceImage: mapboxgl.ImageSource,
  imageWidth: number,
  imageHeight: number
) => {
  const markerLngLatTL = markerNW.getLngLat()
  const markerLngLatBR = markerSE.getLngLat()

  const markerWCTL = wGStoWc(markerLngLatTL)
  const markerWCBR = wGStoWc(markerLngLatBR)

  const wCCoord = getImageCoordinates(
    markerWCTL,
    markerWCBR,
    imageHeight,
    imageWidth
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

  sourceImage.setCoordinates(coordinates)
}

const getImageCoordinates = (
  markerTL: XYCoord,
  markerBR: XYCoord,
  imageWidth: number,
  imageHeight: number
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
  finBR: XYCoord
): number => {
  const lfin = cartesianDistance(finTL, finBR)
  const lor = cartesianDistance(orTL, orBR)
  return lfin / lor
}

const cartesianDistance = (pt1: XYCoord, pt2: XYCoord): number =>
  Math.sqrt(
    (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y)
  )

const getAngle = (A: XYCoord, B: XYCoord): number =>
  Math.atan2(B.y - A.y, B.x - A.x)

const angleBetweenOrFin = (
  orTL: XYCoord,
  orBR: XYCoord,
  finTL: XYCoord,
  finBR: XYCoord
): number => {
  const o = getAngle(orTL, orBR)
  const f = getAngle(finTL, finBR)
  return f - o
}

const offsetBetweenOrFin = (
  orTL: XYCoord,
  orBR: XYCoord,
  finTL: XYCoord,
  finBR: XYCoord
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
  offset: XYCoord
): XYCoord => {
  let pttranform = pt
  pttranform = scalePoint(pttranform, scale)
  pttranform = rotatePoint(pttranform, angle)
  pttranform = translatePoint(pttranform, offset)
  return pttranform
}
