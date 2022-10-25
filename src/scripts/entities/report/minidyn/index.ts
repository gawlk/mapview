import { createBaseReportFromJSON, convertDataLabelGroupsToJSON } from '../base'
import {
  createMinidynZoneFromJSON,
  createFieldFromJSON,
  defaultThresholds,
  createMinidynDropIndexFromJSON,
  createSelectableList,
  getIndexOfSelectedInSelectableList,
} from '/src/scripts'

interface MinidynReportCreatorParameters
  extends MachineReportCreatorParameters {
  project: MinidynProject
}

export const createMinidynReportFromJSON = (
  json: JSONMinidynReport,
  map: mapboxgl.Map | null,
  parameters: MinidynReportCreatorParameters
) => {
  json = upgradeJSON(json)

  const dropIndexes =
    json.distinct.groupedDataLabels.list
      .find((group) => group.from === 'Drop')
      ?.indexes?.list.map((jsonDropIndex) =>
        createMinidynDropIndexFromJSON(jsonDropIndex)
      ) || []

  const report: PartialMachineReport<MinidynReport> = createBaseReportFromJSON(
    json.base,
    map,
    {
      machine: 'Minidyn',
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
        temperature: {
          unit: parameters.project.units.temperature,
          choices: createSelectableList([defaultThresholds.custom], {
            selected: json.distinct.thresholdsSelected.temperature,
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
      createMinidynZoneFromJSON(jsonZone, map, {
        report: report as MinidynReport,
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

  report.toJSON = function (): JSONMinidynReport {
    const report = this as MinidynReport
    const thresholdGroup = this.thresholds
      .groups as MinidynReportThresholdsGroups

    return {
      version: json.version,
      base: this.toBaseJSON(),
      distinct: {
        version: json.version,
        groupedDataLabels:
          convertDataLabelGroupsToJSON<JSONMinidynGroupedDataLabels>(
            report as MinidynReport
          ),
        thresholdsSelected: {
          deflection:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.deflection.choices
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
          temperature:
            getIndexOfSelectedInSelectableList(
              thresholdGroup.temperature.choices
            ) || 0,
          time:
            getIndexOfSelectedInSelectableList(thresholdGroup.time.choices) ||
            0,
        },
      },
    }
  }

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
