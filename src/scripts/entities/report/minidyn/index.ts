import {
  createCustomThreshold,
  createFieldFromJSON,
  createMinidynDropIndexFromJSON,
  createMinidynZoneFromJSON,
  createSelectableList,
  defaultThresholds,
} from '/src/scripts'

import {
  convertDataLabelGroupsToJSON,
  convertThresholdsConfigurationToJSON,
  createBaseReportFromJSON,
} from '../base'

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
              createCustomThreshold(json.distinct.thresholds.modulus.custom),
            ],
            {
              selected: json.distinct.thresholds.modulus.selected,
            }
          ),
        },
        stiffness: {
          unit: parameters.project.units.stiffness,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.stiffness.custom)],
            {
              selected: json.distinct.thresholds.stiffness.selected,
            }
          ),
        },
        deflection: {
          unit: parameters.project.units.deflection,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.deflection.custom)],
            {
              selected: json.distinct.thresholds.deflection.selected,
            }
          ),
        },
        force: {
          unit: parameters.project.units.force,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.force.custom)],
            {
              selected: json.distinct.thresholds.force.selected,
            }
          ),
        },
        time: {
          unit: parameters.project.units.time,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.time.custom)],
            {
              selected: json.distinct.thresholds.time.selected,
            }
          ),
        },
        percentage: {
          unit: parameters.project.units.percentage,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.percentage.custom)],
            {
              selected: json.distinct.thresholds.percentage.selected,
            }
          ),
        },
      },
      jsonGroupedDataLabels: json.distinct.groupedDataLabels,
      dropIndexes,
      project: parameters.project,
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
        thresholds: {
          deflection: convertThresholdsConfigurationToJSON(
            thresholdGroup.deflection.choices
          ),
          force: convertThresholdsConfigurationToJSON(
            thresholdGroup.force.choices
          ),
          modulus: convertThresholdsConfigurationToJSON(
            thresholdGroup.modulus.choices
          ),
          percentage: convertThresholdsConfigurationToJSON(
            thresholdGroup.percentage.choices
          ),
          stiffness: convertThresholdsConfigurationToJSON(
            thresholdGroup.stiffness.choices
          ),
          time: convertThresholdsConfigurationToJSON(
            thresholdGroup.time.choices
          ),
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
