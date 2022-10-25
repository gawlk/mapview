import { createBaseReportFromJSON, convertDataLabelGroupsToJSON } from '../base'
import {
  createMaxidynZoneFromJSON,
  createFieldFromJSON,
  createMaxidynDropIndexFromJSON,
  defaultThresholds,
  createSelectableList,
  getIndexOfSelectedInSelectableList,
} from '/src/scripts'

interface MaxidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  project: MaxidynProject
}

export const createMaxidynReportFromJSON = (
  json: JSONMaxidynReport,
  map: mapboxgl.Map | null,
  parameters: MaxidynReportCreatorParameters
) => {
  json = upgradeJSON(json)

  const dropIndexes =
    json.distinct.groupedDataLabels.list
      .find((group) => group.from === 'Drop')
      ?.indexes?.list.map((jsonDropIndex) =>
        createMaxidynDropIndexFromJSON(jsonDropIndex)
      ) || []

  const report: PartialMachineReport<MaxidynReport> = createBaseReportFromJSON(
    json.base,
    map,
    {
      machine: 'Maxidyn',
      thresholdsGroups: {
        modulus: {
          unit: parameters.project.units.modulus,
          choices: createSelectableList(
            [
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
            {
              selected: json.distinct.thresholdsSelected.modulus,
            }
          ),
        },
        stiffness: {
          unit: parameters.project.units.stiffness,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.stiffness,
          }),
        },
        deflection: {
          unit: parameters.project.units.deflection,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.deflection,
          }),
        },
        force: {
          unit: parameters.project.units.force,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.force,
          }),
        },
        distance: {
          unit: parameters.project.units.distance,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.distance,
          }),
        },
        time: {
          unit: parameters.project.units.time,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.time,
          }),
        },
        percentage: {
          unit: parameters.project.units.percentage,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.percentage,
          }),
        },
      },
      jsonGroupedDataLabels: json.distinct.groupedDataLabels,
      dropIndexes,
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
    ...json.base.platform.map((field: JSONField) => createFieldFromJSON(field))
  )

  report.information.push(
    ...json.base.information.map((field: JSONField) =>
      createFieldFromJSON(field)
    )
  )

  report.toJSON = function (): JSONMaxidynReport {
    const report = this as MaxidynReport
    const thresholdGroup = this.thresholds
      .groups as MaxidynReportThresholdsGroups

    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.version,
        groupedDataLabels:
          convertDataLabelGroupsToJSON<JSONMaxidynGroupedDataLabels>(
            report as MaxidynReport
          ),
        thresholdsSelected: {
          deflection:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.deflection.choices
            ) || 0,
          distance:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.distance.choices
            ) || 0,
          force:
            getIndexOfSelectedInSelectableList(thresholdGroup.force.choices) ||
            0,
          modulus:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.modulus.choices
            ) || 0,
          percentage:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.percentage.choices
            ) || 0,
          stiffness:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.stiffness.choices
            ) || 0,

          time:
            getIndexOfSelectedInSelectableList(thresholdGroup.time.choices) ||
            0,
        },
      },
    }
  }

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
