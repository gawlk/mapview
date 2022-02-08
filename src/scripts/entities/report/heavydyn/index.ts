import { createBaseReportFromJSON } from '../base'
import {
  createHeavydynPointFromJSON,
  createHeavydynFieldFromJSON,
} from '/src/scripts'

export const createHeavydynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map,
  parameters: MachineReportCreatorParameters
) => {
  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'heavydyn',
      createPointFromJSON: createHeavydynPointFromJSON,
      createFieldFromJSON: createHeavydynFieldFromJSON,
      ...parameters,
    }
  )

  return report as HeavydynReport

  // const point = createPoint(1, 'circle', map.getCenter(), map)

  // point.finalData.D0 = createMathNumber(100, unitDeformation)
  // point.finalData.F0 = createMathNumber(100, unitForce)
  // point.finalData.T0 = createMathNumber(100, unitTemperature)
  // point.finalData.P0 = createMathNumber(100, '%')

  // const point2 = createPoint(
  //   2,
  //   'circle',
  //   {
  //     lat: map.getCenter().lat + 0.05,
  //     lng: map.getCenter().lng + 0.05,
  //   },
  //   map
  // )

  // point2.finalData.D0 = createMathNumber(400, unitDeformation)
  // point2.finalData.F0 = createMathNumber(400, unitForce)
  // point2.finalData.T0 = createMathNumber(400, unitTemperature)
  // point2.finalData.P0 = createMathNumber(400, '%')
}
