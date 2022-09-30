import { createBaseReportFromJSON } from '../base'
import {
  createHeavydynZoneFromJSON,
  createHeavydynFieldFromJSON,
  createHeavydynDropIndexFromJSON,
  defaultThresholds,
  createWatcherHandler,
} from '/src/scripts'

export const createHeavydynReportFromJSON = (
  json: JSONHeavydynReport,
  map: mapboxgl.Map | null,
  parameters: {
    project: HeavydynProject
  }
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const dropIndexes = json.distinct.groupedDataLabels.list
    .find((group) => group.from === 'Drop')
    ?.indexes?.list.map((jsonDropIndex) =>
      createHeavydynDropIndexFromJSON(jsonDropIndex, {
        project: parameters.project,
      })
    )

  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json.base,
    map,
    {
      machine: 'Heavydyn',
      thresholds: {
        deflection: [defaultThresholds.custom],
        force: [defaultThresholds.custom],
        temperature: [defaultThresholds.custom],
        distance: [defaultThresholds.custom],
        time: [defaultThresholds.custom],
      },
      jsonGroupedDataLabels: json.distinct.groupedDataLabels,
      ...parameters,
    }
  )

  report.zones.push(
    ...json.base.zones.map((jsonZone) =>
      createHeavydynZoneFromJSON(jsonZone, map, {
        report: report as HeavydynReport,
      })
    )
  )

  report.platform.push(
    ...json.base.platform.map((field: JSONBaseField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  report.information.push(
    ...json.base.information.map((field: JSONBaseField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  const baseAddToMap = report.addToMap
  report.addToMap = () => {
    baseAddToMap.call(report)

    dropIndexes?.forEach((dropIndex) => {
      if (typeof dropIndex.value.unit === 'object') {
        watcherHandler.add(
          watch(dropIndex.value.unit, () => {
            dropIndex.value.updateDisplayedStrings()
          })
        )
      }
    })
  }

  const baseRemove = report.remove
  report.remove = () => {
    baseRemove.call(report)

    watcherHandler.clean()
  }

  return report as HeavydynReport
}

const upgradeJSON = (json: JSONHeavydynReportVAny): JSONHeavydynReport => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONHeavydynReport
  }

  return json
}
