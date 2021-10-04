import { createBaseReport } from '../base'
import { createMinidynField } from '/src/scripts'

export const createMinidynReport = (
  json: JSONReport,
  map: mapboxgl.Map,
  units: MathUnit[]
) => {
  const report: PartialMachineReport<MinidynReport> = createBaseReport(
    json,
    map,
    {
      kind: 'minidyn',
      createField: createMinidynField,
      units,
    }
  )

  return report as MinidynReport
}
