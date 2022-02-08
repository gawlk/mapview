import { createBaseReportFromJSON } from '../base'
import {
  createMinidynPointFromJSON,
  createMinidynFieldFromJSON,
} from '/src/scripts'

export const createMinidynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: MachineReportCreatorParameters
) => {
  const report: PartialMachineReport<MinidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'minidyn',
      createPointFromJSON: createMinidynPointFromJSON,
      createFieldFromJSON: createMinidynFieldFromJSON,
      ...parameters,
    }
  )

  return report as MinidynReport
}
