import { createBaseReport } from '../base'

export const createHeavydynReport = (
  data: JSONReport,
  map: mapboxgl.Map,
  units: MathUnit[]
) => {
  const baseReport = createBaseReport(data, map)

  const report: HeavydynReport = {
    kind: 'heavydyn' as const,
    ...baseReport,
  }

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

  return report
}
