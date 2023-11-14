import { store } from '/src/store'

export const movePointToZoneIndex = (point: BasePoint, zoneIndex: number) => {
  const zones = store.selectedReport()?.zones()

  batch(() => {
    zones?.some((zone: BaseZone) => {
      const index = zone.points().findIndex((_point) => _point === point)

      if (index !== -1) {
        zone.setPoints(zone.points().splice(index, 1))

        const newZone = zones[zoneIndex]
        const points = newZone.points() as BasePoint[]
        points.push(point)
        newZone.setPoints(points)

        point.zone.set(zones[zoneIndex])

        return true
      }

      return false
    })
  })
}
