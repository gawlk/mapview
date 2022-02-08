import { createBaseReportFromJSON } from '../base'
import {
  createMaxidynPointFromJSON,
  createMaxidynFieldFromJSON,
} from '/src/scripts'

export const createMaxidynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: MachineReportCreatorParameters
) => {
  const report: PartialMachineReport<MaxidynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'maxidyn',
      createPointFromJSON: createMaxidynPointFromJSON,
      createFieldFromJSON: createMaxidynFieldFromJSON,
      ...parameters,
    }
  )

  return report as MaxidynReport
}
