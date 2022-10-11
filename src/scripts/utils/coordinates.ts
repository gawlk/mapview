const ddToDmsHelper = (dd: number, isLat: boolean) => {
    const deg = dd > 0 ? Math.floor(dd) : Math.ceil(dd);
    const min = Math.floor((Math.abs(dd) - Math.abs(deg)) * 60);
    const sec = (Math.abs(dd) - Math.abs(deg) - min / 60) * 3600;
    const dir = isLat ? (dd >= 0 ? 'N' : 'S') : (dd >= 0 ? 'E' : 'W')

    return `${deg}°${min}'${sec.toFixed(4)}"${dir}`
}

export const ddToDms = (coordinates: { lng: number, lat: number }): { lng: string, lat: string } => {
    const { lng, lat } = coordinates
    const lngDms = ddToDmsHelper(lng, false)
    const latDms = ddToDmsHelper(lat, true)

    return { lng: lngDms, lat: latDms }
}