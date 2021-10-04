import { createBaseReport } from '../base'

export const createMaxidynReport = (
  data: JSONReport,
  map: mapboxgl.Map,
  units: MathUnit[]
) => {
  const baseReport = createBaseReport(data, map, units)

  const report: MaxidynReport = {
    kind: 'maxidyn' as const,
    ...baseReport,
  }

  return report
}
