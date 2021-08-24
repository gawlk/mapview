import { shallowReactive, watch } from 'vue'

export const createReport = (
  name: string,
  map: mapboxgl.Map,
  points: Point[],
  line: Line,
  dataSettings: DataSettings
): Report => {
  dataSettings = shallowReactive(dataSettings)

  const report: Report = shallowReactive({
    name,
    images: [],
    points,
    line,
    dataSettings,
    isVisible: true,
    icon: 'circle',
  })

  points.forEach((point) => {
    point.selectedData = dataSettings.selected
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

  watch(
    () => report.icon,
    (icon: string) => {
      points.forEach((point) => {
        point.icon.setIcon(icon)
      })
    }
  )

  watch(
    () => dataSettings.selected,
    (selectedData: string) => {
      points.forEach((point) => {
        point.selectedData = selectedData
      })
    }
  )

  return report
}
