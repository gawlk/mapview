import mapbox from 'mapbox-gl'

import { fileToBase64 } from '../utils/file'
import * as mercator from '../utils/googleMercator'
import { lngLatCoord, xyCoord, imageCoord } from '../utils/coordTypes'

const EARTH_RADIUS = 6.371e6

export const createImageMap = async (
    map: mapbox.Map,
    image: File,
    id: string
) => {
    const data64 = (await fileToBase64(image)) as string

    const { width, height } = (await getImageDimensions(data64)) as {
        width: number
        height: number
    }

    const coordinates = await initialiseImageCoordinates(map, width, height)

    map.addSource(id, {
        type: 'image',
        url: data64,
        coordinates,
    })

    map.addLayer({
        id: `${id}-raster`,
        source: id,
        type: 'raster',
        paint: {
            'raster-opacity': 0.5,
            'raster-fade-duration': 0,
        },
    })

    const sourceImage = map.getSource(id) as mapbox.ImageSource

    const markerNW = createMarker(coordinates[0], map)

    const markerSE = createMarker(coordinates[2], map)

    setMarkerResizeEvents(
        markerNW,
        markerSE,
        sourceImage,
        coordinates,
        width,
        height
    )
}

const initialiseImageCoordinates = async (
    map: mapbox.Map,
    imageWidth: number,
    imageHeight: number
): Promise<
    [[number, number], [number, number], [number, number], [number, number]]
> => {
    const imageRatioX = imageWidth > imageHeight ? 1 : imageWidth / imageHeight
    const imageRatioY = imageHeight > imageWidth ? 1 : imageHeight / imageWidth

    const center = map.getCenter()
    const bounds = map.getBounds()

    const nw = bounds.getNorthWest()
    const se = bounds.getSouthEast()

    const boundsWidth = Math.abs(se.lng - nw.lng)
    const boundsHeight = Math.abs(nw.lat - se.lat)

    console.log(boundsWidth, boundsHeight)

    const boundsRatioX =
        boundsWidth > boundsHeight ? 1 : boundsWidth / boundsHeight
    const boundsRatioY =
        boundsHeight > boundsWidth ? 1 : boundsHeight / boundsWidth

    nw.lng += (center.lng - nw.lng) / 2
    nw.lat -= (nw.lat - center.lat) / 2

    se.lng -= (se.lng - center.lng) / 2
    se.lat += (center.lat - se.lat) / 2

    console.log(imageRatioX, imageRatioY, boundsRatioX, boundsRatioY)

    console.log(nw, se)

    // Clock wise from top left
    return [
        [nw.lng, nw.lat],
        [se.lng, nw.lat],
        [se.lng, se.lat],
        [nw.lng, se.lat],
    ]
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

const createMarker = (coordinates: [number, number], map: mapbox.Map) =>
    new mapbox.Marker().setLngLat(coordinates).setDraggable(true).addTo(map)

const setMarkerResizeEvents = (
    markerNW: mapbox.Marker,
    markerSE: mapbox.Marker,
    sourceImage: mapbox.ImageSource,
    coordinates: [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
    ],
    imageWidth: number,
    imageHeight: number
) => {
    const onMarkerDrag = () => {
        const markerLngLatTL = markerNW.getLngLat()
        const markerLngLatBR = markerSE.getLngLat()

        const markerWCTL = mercator.wGStoWc(markerLngLatTL)
        const markerWCBR = mercator.wGStoWc(markerLngLatBR)

        const wCCoord = getImageCoordinates(
            markerWCTL,
            markerWCBR,
            imageHeight,
            imageWidth
        )

        const markerWGSTL = mercator.wcToWGS(wCCoord.tl)
        const markerWGSTR = mercator.wcToWGS(wCCoord.tr)
        const markerWGSBL = mercator.wcToWGS(wCCoord.bl)
        const markerWGSBR = mercator.wcToWGS(wCCoord.br)

        coordinates[0] = [markerWGSTL.lng, markerWGSTL.lat]
        coordinates[3] = [markerWGSTR.lng, markerWGSTR.lat]
        coordinates[1] = [markerWGSBL.lng, markerWGSBL.lat]
        coordinates[2] = [markerWGSBR.lng, markerWGSBR.lat]

        sourceImage.setCoordinates(coordinates)
    }

    markerNW.on('drag', onMarkerDrag)
    markerSE.on('drag', onMarkerDrag)
}

function getImageCoordinates(
    markerTL: xyCoord,
    markerBR: xyCoord,
    imageWidth: number,
    imageHeight: number
): imageCoord {
    const orTL: xyCoord = { x: -imageWidth / 2, y: +imageHeight / 2 }
    const orTR: xyCoord = { x: +imageWidth / 2, y: +imageHeight / 2 }
    const orBL: xyCoord = { x: -imageWidth / 2, y: -imageHeight / 2 }
    const orBR: xyCoord = { x: +imageWidth / 2, y: -imageHeight / 2 }

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

function scaleFactorBetweenOrFin(
    orTL: xyCoord,
    orBR: xyCoord,
    finTL: xyCoord,
    finBR: xyCoord
): number {
    const lfin = cartesianDistance(finTL, finBR)
    const lor = cartesianDistance(orTL, orBR)
    return lfin / lor
}

function cartesianDistance(pt1: xyCoord, pt2: xyCoord): number {
    return Math.sqrt(
        (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y)
    )
}

function getAngle(A: xyCoord, B: xyCoord): number {
    return Math.atan2(B.y - A.y, B.x - A.x)
}

function angleBetweenOrFin(
    orTL: xyCoord,
    orBR: xyCoord,
    finTL: xyCoord,
    finBR: xyCoord
): number {
    const o = getAngle(orTL, orBR)
    const f = getAngle(finTL, finBR)
    return f - o
}

function offsetBetweenOrFin(
    orTL: xyCoord,
    orBR: xyCoord,
    finTL: xyCoord,
    finBR: xyCoord
): xyCoord {
    const midOr: xyCoord = {
        x: (orTL.x + orBR.x) / 2,
        y: (orTL.y + orBR.y) / 2,
    }
    const midfin: xyCoord = {
        x: (finTL.x + finBR.x) / 2,
        y: (finTL.y + finBR.y) / 2,
    }

    return {
        x: midfin.x - midOr.x,
        y: midfin.y - midOr.y,
    }
}

function scalePoint(pt: xyCoord, scale: number): xyCoord {
    return {
        x: pt.x * scale,
        y: pt.y * scale,
    }
}

function translatePoint(pt: xyCoord, offset: xyCoord): xyCoord {
    return {
        x: pt.x + offset.x,
        y: pt.y + offset.y,
    }
}

function rotatePoint(pt: xyCoord, angle: number): xyCoord {
    return {
        x: pt.x * Math.cos(angle) - pt.y * Math.sin(angle),
        y: pt.x * Math.sin(angle) + pt.y * Math.cos(angle),
    }
}

function transformPoint(
    pt: xyCoord,
    scale: number,
    angle: number,
    offset: xyCoord
): xyCoord {
    let pttranform = pt
    pttranform = scalePoint(pttranform, scale)
    pttranform = rotatePoint(pttranform, angle)
    pttranform = translatePoint(pttranform, offset)
    return pttranform
}
