import { createBaseReportFromJSON } from '../base'
import {
  createMaxidynZoneFromJSON,
  createMaxidynFieldFromJSON,
  createMaxidynDropIndexFromJSON,
  defaultThresholds,
} from '/src/scripts'

export const createMaxidynReportFromJSON = (
  json: JSONMaxidynReport,
  map: mapboxgl.Map | null,
  parameters: {
    project: MaxidynProject
  }
) => {
  json = upgradeJSON(json)

  const dropIndexes = json.distinct.groupedDataLabels.list
    .find((group) => group.from === 'Drop')
    ?.indexes?.list.map((jsonDropIndex) =>
      createMaxidynDropIndexFromJSON(jsonDropIndex)
    )

  const report: PartialMachineReport<MaxidynReport> = createBaseReportFromJSON(
    json.base,
    map,
    {
      machine: 'Maxidyn',
      thresholds: {
        modulus: [
          defaultThresholds.ns,
          defaultThresholds.ar1,
          defaultThresholds.ar2,
          defaultThresholds.ar3,
          defaultThresholds.ar4,
          defaultThresholds.pf1,
          defaultThresholds.pf2,
          defaultThresholds['pf2+'],
          defaultThresholds.pf3,
          defaultThresholds.pf4,
          defaultThresholds.custom,
        ],
        stiffness: [defaultThresholds.custom],
        deflection: [defaultThresholds.custom],
        force: [defaultThresholds.custom],
        distance: [defaultThresholds.custom],
        time: [defaultThresholds.custom],
        percentage: [defaultThresholds.custom],
      },
      jsonGroupedDataLabels: json.distinct.groupedDataLabels,
      ...parameters,
    }
  )

  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createMaxidynZoneFromJSON(jsonZone, map, {
        report: report as MaxidynReport,
      })
    )
  )

  report.platform.push(
    ...json.base.platform.map((field: JSONBaseField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  report.information.push(
    ...json.base.information.map((field: JSONBaseField) =>
      createMaxidynFieldFromJSON(field)
    )
  )

  return report as MaxidynReport
}

const upgradeJSON = (json: JSONMaxidynReportVAny): JSONMaxidynReport => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMaxidynReport
  }

  return json
}
