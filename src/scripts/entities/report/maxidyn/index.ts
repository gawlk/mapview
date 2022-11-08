import {
  createBaseReportFromJSON,
  convertDataLabelGroupsToJSON,
  convertThresholdsConfigurationToJSON,
} from '../base'
import {
  createMaxidynZoneFromJSON,
  createFieldFromJSON,
  createMaxidynDropIndexFromJSON,
  defaultThresholds,
  createCustomThreshold,
  createSelectableList,
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
        distance: {
          unit: parameters.project.units.distance,
          choices: createSelectableList(
            [createCustomThreshold(json.distinct.thresholds.distance.custom)],
            {
              selected: json.distinct.thresholds.distance.selected,
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
        thresholds: {
          deflection: convertThresholdsConfigurationToJSON(
            thresholdGroup.deflection.choices
          ),
          distance: convertThresholdsConfigurationToJSON(
            thresholdGroup.distance.choices
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
