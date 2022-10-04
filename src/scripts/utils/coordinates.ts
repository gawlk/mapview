const ddToDmsHelper = (dd: number, isLat: boolean) => {
    const deg = Math.floor(dd)
    const min = Math.floor((dd - deg) * 60)
    const sec = ((dd - deg - min / 60) * 3600).toFixed(4)
    const dir = isLat ? (dd >= 0 ? 'N' : 'S') : (dd >= 0 ? 'E' : 'W')

    return `${deg}°${min}'${sec}"${dir}`
}

export const ddToDms = (coordinates: { lng: number, lat: number }): { lng: string, lat: string } => {
    const { lng, lat } = coordinates
    const lngDms = ddToDmsHelper(lng, false)
    const latDms = ddToDmsHelper(lat, true)

    return { lng: lngDms, lat: latDms }
}