import { shallowReactive, watch } from 'vue'

export const createReport = (
  name: string,
  map: mapboxgl.Map,
  points: Point[],
  line: Line,
  dataSettings: DataSettings
): Report => {
  const report: Report = shallowReactive({
    name,
    images: [],
    points,
    line,
    dataSettings,
    isVisible: true,
  })

  watch(
    () => report.isVisible,
    (isVisible: boolean) => {
      report.points.forEach((point) => {
        if (isVisible && point.isVisible) {
          point.marker.addTo(map)
        } else {
          point.marker.remove()
        }
      })

      if (isVisible) {
        report.line?.addToMap()
      } else {
        report.line?.remove()
      }
    }
  )

  return report
}
