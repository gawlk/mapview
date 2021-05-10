import { lngLatCoord, xyCoord } from '../utils/coordTypes'

// Google Mercator constants definition
const TILESIZE = 256
const PIXELPERRADIAN = 256 / (2.0 * Math.PI)
const DEGREETORADIAN = Math.PI / 180.0
const RADIANTODEGREE = 180.0 / Math.PI
const ORWX = 128
const ORWY = 128

export function latToWc(lat: number): number {
    const sy = Math.sin(lat * DEGREETORADIAN)
    return ORWY - 0.5 * Math.log((1 + sy) / (1 - sy)) * PIXELPERRADIAN
}

export function longToWc(lng: number): number {
    return ORWX + (lng * TILESIZE) / 360.0
}

export function wcToLat(wcY: number): number {
    const lr = (ORWY - wcY) / PIXELPERRADIAN
    return (2.0 * Math.atan(Math.exp(lr)) - Math.PI / 2.0) * RADIANTODEGREE
}

export function wcToLong(wcX: number): number {
    return ((wcX - ORWX) * 360) / TILESIZE
}

export function wcToWGS(wc: xyCoord): lngLatCoord {
    const lng = wcToLong(wc.x)
    const lat = wcToLat(wc.y)
    const coord: lngLatCoord = {
        lng: lng,
        lat: lat,
    }
    return coord
}

export function wGStoWc(wgs: lngLatCoord): xyCoord {
    const wcX = longToWc(wgs.lng)
    const wcY = latToWc(wgs.lat)
    const coord: xyCoord = {
        x: wcX,
        y: wcY,
    }
    return coord
}
