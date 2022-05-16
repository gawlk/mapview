import { createBaseReportFromJSON } from '../base'
import {
  createHeavydynZoneFromJSON,
  createHeavydynFieldFromJSON,
  createCustomThreshold,
  createMathNumber,
  createWatcherHandler,
} from '/src/scripts'

export const createHeavydynReportFromJSON = (
  json: JSONReport,
  map: mapboxgl.Map | null,
  parameters: HeavydynReportCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()

  const dropIndexes = json.dataLabels.groups.list.find(
    (group) => group.from === 'Drop'
  )?.indexes?.list as JSONHeavydynDropIndex[]

  dropIndexes.forEach((jsonDropIndex: JSONHeavydynDropIndex) => {
    ;(jsonDropIndex as unknown as HeavydynDropIndex).value = createMathNumber(
      jsonDropIndex.value,
      parameters.project.units[
        jsonDropIndex.unit.toLocaleLowerCase() as keyof HeavydynMathUnits
      ]
    )
  })

  const report: PartialMachineReport<HeavydynReport> = createBaseReportFromJSON(
    json,
    map,
    {
      machine: 'Heavydyn',
      thresholds: {
        deflection: [createCustomThreshold(0)],
        load: [createCustomThreshold(0)],
        temperature: [createCustomThreshold(0)],
        distance: [createCustomThreshold(0)],
        time: [createCustomThreshold(0)],
      },
      ...parameters,
      addToMap: () => {
        ;(dropIndexes as unknown as HeavydynDropIndex[]).forEach(
          (dropIndex) => {
            if (typeof dropIndex.value.unit === 'object') {
              watcherHandler.add(
                watch(dropIndex.value.unit, () => {
                  dropIndex.value.updateDisplayedStrings()
                })
              )
            }
          }
        )
      },
      remove: () => {
        watcherHandler.clean()
      },
    }
  )

  report.zones.push(
    ...json.zones.map((jsonZone) =>
      createHeavydynZoneFromJSON(jsonZone, map, {
        report: report as HeavydynReport,
      })
    )
  )

  report.platform.push(
    ...json.platform.map((field: JSONField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  report.informations.push(
    ...json.informations.map((field: JSONField) =>
      createHeavydynFieldFromJSON(field)
    )
  )

  return report as HeavydynReport
}
