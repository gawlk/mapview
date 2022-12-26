import {
  createCustomThreshold,
  createSelectableList,
  defaultThresholds,
} from '/src/scripts'

export const createMaxidynThresholdsGroupsFromJSON = (
  json: JSONMaxidynThresholdsConfigurations,
  units: MaxidynMathUnits
) => {
  const thresholdsGroups: MaxidynThresholdsGroups = {
    modulus: {
      unit: units.modulus,
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
          createCustomThreshold(json.modulus.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.modulus.selectedIndex,
        }
      ),
    },
    stiffness: {
      unit: units.stiffness,
      choices: createSelectableList(
        [createCustomThreshold(json.stiffness.custom)] as ThresoldsList,
        {
          selectedIndex: json.stiffness.selectedIndex,
        }
      ),
    },
    deflection: {
      unit: units.deflection,
      choices: createSelectableList(
        [createCustomThreshold(json.deflection.custom)] as ThresoldsList,
        {
          selectedIndex: json.deflection.selectedIndex,
        }
      ),
    },
    force: {
      unit: units.force,
      choices: createSelectableList(
        [createCustomThreshold(json.force.custom)] as ThresoldsList,
        {
          selectedIndex: json.force.selectedIndex,
        }
      ),
    },
    distance: {
      unit: units.distance,
      choices: createSelectableList(
        [createCustomThreshold(json.distance.custom)] as ThresoldsList,
        {
          selectedIndex: json.distance.selectedIndex,
        }
      ),
    },
    time: {
      unit: units.time,
      choices: createSelectableList(
        [createCustomThreshold(json.time.custom)] as ThresoldsList,
        {
          selectedIndex: json.time.selectedIndex,
        }
      ),
    },
    percentage: {
      unit: units.percentage,
      choices: createSelectableList(
        [createCustomThreshold(json.percentage.custom)] as ThresoldsList,
        {
          selectedIndex: json.percentage.selectedIndex,
        }
      ),
    },
  }

  return thresholdsGroups
}
