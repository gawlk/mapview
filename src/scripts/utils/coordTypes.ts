
export interface lngLatCoord {
    lng: number
    lat: number
}

export interface xyCoord {
    x: number
    y: number
}

export interface imageCoord {
    tl : xyCoord
    tr : xyCoord
    bl : xyCoord
    br : xyCoord
}