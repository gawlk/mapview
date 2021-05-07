import mapbox from 'mapbox-gl'

mapbox.accessToken =
    'pk.eyJ1Ijoia2dhd2xpayIsImEiOiJjam1nMHE0Z2kwaTMzM3FwYTc0eDd1N2g0In0.eAfnfMMVkmrAiwj5RdUKYw'

export const createMap = (container: string) => {
    return new mapbox.Map({
        container, // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9, // starting zoom
        preserveDrawingBuffer: true,
    })
}
