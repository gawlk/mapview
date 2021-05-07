import mapbox from 'mapbox-gl'

import { fileToBase64 } from '../utils/file'

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
        coordinates,
        sourceImage,
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
    coordinates: [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
    ],
    sourceImage: mapbox.ImageSource,
    imageWidth: number,
    imageHeight: number
) => {
    const onMarkerDrag = () => {
        const markerLngLatNW = markerNW.getLngLat()
        const markerLngLatSE = markerSE.getLngLat()

        const markerCoordinatesNW: [number, number] = [
            markerLngLatNW.lng,
            markerLngLatNW.lat,
        ]

        const markerCoordinatesSE: [number, number] = [
            markerLngLatSE.lng,
            markerLngLatSE.lat,
        ]

        const markerEQNW: [number, number] = [
            lngToX(markerLngLatNW.lng),
            latToY(markerLngLatNW.lat),
        ]

        const markerEQSE: [number, number] = [
            lngToX(markerLngLatSE.lng),
            latToY(markerLngLatSE.lat),
        ]

        coordinates[0] = markerCoordinatesNW
        // coordinates[1] =
        coordinates[2] = markerCoordinatesSE
        // coordinates[3] =

        sourceImage.setCoordinates(coordinates)
    }

    markerNW.on('drag', onMarkerDrag)
    markerSE.on('drag', onMarkerDrag)
}

const lngToX = (lng: number) => {
    return EARTH_RADIUS * lng
}

const latToY = (lat: number) => {
    return EARTH_RADIUS * lat
}

const xToLng = (x: number) => {
    return x / EARTH_RADIUS
}

const yToLat = (y: number) => {
    return y / EARTH_RADIUS
}

// const setMarkerDragEvent = (
//     markerResize: mapbox.Marker,
//     markerDrag: mapbox.Marker,
//     markerRotate: mapbox.Marker,
//     coordinates: [
//         [number, number],
//         [number, number],
//         [number, number],
//         [number, number]
//     ],
//     sourceImage: mapbox.ImageSource
// ) => {
//     markerDrag.on('drag', () => {
//         const markerLngLat = markerDrag.getLngLat()
//         const markerCoordinates: [number, number] = [
//             markerLngLat.lng,
//             markerLngLat.lat,
//         ]
//         const lngDiff = markerCoordinates[0] - coordinates[1][0]
//         const latDiff = markerCoordinates[1] - coordinates[1][1]
//
//         coordinates[0][0] += lngDiff
//         coordinates[0][1] += latDiff
//         coordinates[1] = markerCoordinates
//         coordinates[2][0] += lngDiff
//         coordinates[2][1] += latDiff
//         coordinates[3][0] += lngDiff
//         coordinates[3][1] += latDiff
//
//         sourceImage.setCoordinates(coordinates)
//     })
// }
