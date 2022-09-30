import { createBaseReportFromJSON } from '../base'
import {
  createMinidynZoneFromJSON,
  createMinidynFieldFromJSON,
  defaultThresholds,
  createMinidynDropIndexFromJSON,
} from '/src/scripts'

export const createMinidynReportFromJSON = (
  json: JSONMinidynReport,
  map: mapboxgl.Map | null,
  parameters: {
    project: MinidynProject
  }
) => {
  json = upgradeJSON(json)

  const dropIndexes = json.distinct.groupedDataLabels.list
    .find((group) => group.from === 'Drop')
    ?.indexes?.list.map((jsonDropIndex) =>
      createMinidynDropIndexFromJSON(jsonDropIndex)
    )

  const report: PartialMachineReport<MinidynReport> = createBaseReportFromJSON(
    json.base,
    map,
    {
      machine: 'Minidyn',
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
        temperature: [defaultThresholds.custom],
        time: [defaultThresholds.custom],
        percentage: [defaultThresholds.custom],
      },
      jsonGroupedDataLabels: json.distinct.groupedDataLabels,
      ...parameters,
    }
  )

  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createMinidynZoneFromJSON(jsonZone, map, {
        report: report as MinidynReport,
      })
    )
  )

  report.platform.push(
    ...json.base.platform.map((field: JSONBaseField) =>
      createMinidynFieldFromJSON(field)
    )
  )

  report.information.push(
    ...json.base.information.map((field: JSONBaseField) =>
      createMinidynFieldFromJSON(field)
    )
  )

  return report as MinidynReport
}

const upgradeJSON = (json: JSONMinidynReportVAny): JSONMinidynReport => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynReport
  }

  return json
}
