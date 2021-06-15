// Google Mercator constants definition

const TILESIZE = 256
const PIXELPERRADIAN = 256 / (2.0 * Math.PI)
const DEGREETORADIAN = Math.PI / 180.0
const RADIANTODEGREE = 180.0 / Math.PI
const ORWX = 128
const ORWY = 128

export const latToWc = (lat: number): number => {
  const sy = Math.sin(lat * DEGREETORADIAN)
  return ORWY - 0.5 * Math.log((1 + sy) / (1 - sy)) * PIXELPERRADIAN
}

export const longToWc = (lng: number): number => ORWX + (lng * TILESIZE) / 360.0

export const wcToLat = (wcY: number): number => {
  const lr = (ORWY - wcY) / PIXELPERRADIAN
  return (2.0 * Math.atan(Math.exp(lr)) - Math.PI / 2.0) * RADIANTODEGREE
}

export const wcToLong = (wcX: number): number => ((wcX - ORWX) * 360) / TILESIZE

export const wcToWGS = (wc: XYCoord): LngLatCoord => {
  const lng = wcToLong(wc.x)
  const lat = wcToLat(wc.y)
  const coord: LngLatCoord = {
    lng: lng,
    lat: lat,
  }
  return coord
}

export const wGStoWc = (wgs: LngLatCoord): XYCoord => {
  const wcX = longToWc(wgs.lng)
  const wcY = latToWc(wgs.lat)
  const coord: XYCoord = {
    x: wcX,
    y: wcY,
  }
  return coord
}
