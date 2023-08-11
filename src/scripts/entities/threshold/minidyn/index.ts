import {
  createCustomThreshold,
  createSelectableList,
  defaultThresholds,
} from '/src/scripts'

export const createMinidynThresholdsGroupsFromJSON = (
  json: JSONMinidynThresholdsConfigurationsVAny,
  units: MinidynMathUnits,
) => {
  json = upgradeJSON(json)

  const thresholdsGroups: MinidynThresholdsGroups = {
    modulus: {
      unit: units.modulus,
      choices: createSelectableList(
        [
          ...defaultThresholds.modulus,
          createCustomThreshold(json.modulus.custom),
        ] as ThresoldsList,
        {
          selectedIndex: json.modulus.selectedIndex,
        },
      ),
    },
    stiffness: {
      unit: units.stiffness,
      choices: createSelectableList(
        [createCustomThreshold(json.stiffness.custom)] as ThresoldsList,
        {
          selectedIndex: json.stiffness.selectedIndex,
        },
      ),
    },
    deflection: {
      unit: units.deflection,
      choices: createSelectableList(
        [createCustomThreshold(json.deflection.custom)] as ThresoldsList,
        {
          selectedIndex: json.deflection.selectedIndex,
        },
      ),
    },
    distance: {
      unit: units.distance,
      choices: createSelectableList(
        [createCustomThreshold(json.distance.custom)] as ThresoldsList,
        {
          selectedIndex: json.distance.selectedIndex,
        },
      ),
    },
    force: {
      unit: units.force,
      choices: createSelectableList(
        [createCustomThreshold(json.force.custom)] as ThresoldsList,
        {
          selectedIndex: json.force.selectedIndex,
        },
      ),
    },
    time: {
      unit: units.time,
      choices: createSelectableList(
        [createCustomThreshold(json.time.custom)] as ThresoldsList,
        {
          selectedIndex: json.time.selectedIndex,
        },
      ),
    },
    percentage: {
      unit: units.percentage,
      choices: createSelectableList(
        [createCustomThreshold(json.percentage.custom)] as ThresoldsList,
        {
          selectedIndex: json.percentage.selectedIndex,
        },
      ),
    },
  }

  return thresholdsGroups
}

const upgradeJSON = (
  json: JSONMinidynThresholdsConfigurationsVAny,
): JSONMinidynThresholdsConfigurations => {
  switch (json.version) {
    case undefined:
    case 1:
    // upgrade
  }

  return json
}
