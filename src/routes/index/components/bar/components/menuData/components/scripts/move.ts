import store from '/src/store'

export const movePointToZoneIndex = (point: BasePoint, zoneIndex: number) => {
  const zones = store.selectedReport?.zones

  zones?.some((zone) => {
    const index = zone.points.findIndex((_point) => _point === point)

    if (index !== -1) {
      zone.points.splice(index, 1)

      const points: BasePoint[] = zones[zoneIndex].points

      points.push(point)

      point.zone = zones[zoneIndex]

      if (store.selectedReport?.settings.colorization === 'Zone') {
        point.updateColor()
      }

      return true
    } else {
      return false
    }
  })
}
