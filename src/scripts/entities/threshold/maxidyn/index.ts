import {
  createCustomThreshold,
  createDefaultModulusThresholds,
  createSL,
} from '/src/scripts'

export const createMaxidynThresholdsGroupsFromJSON = (
  json: JSONMaxidynThresholdsConfigurationsVAny,
  units: MaxidynMathUnits,
) => {
  json = upgradeJSON(json)

  const thresholdsGroups: MaxidynThresholdsGroups = {
    modulus: {
      unit: units.modulus,
      choices: createSL(
        [
          createCustomThreshold(json.modulus.custom, units.modulus),
          ...createDefaultModulusThresholds(units.modulus),
        ] as ThresoldsList,
        {
          selectedIndex: json.modulus.selectedIndex,
        },
      ),
    },
    stiffness: {
      unit: units.stiffness,
      choices: createSL(
        [
          createCustomThreshold(json.stiffness.custom, units.stiffness),
        ] as ThresoldsList,
        {
          selectedIndex: json.stiffness.selectedIndex,
        },
      ),
    },
    deflection: {
      unit: units.deflection,
      choices: createSL(
        [
          createCustomThreshold(json.deflection.custom, units.deflection),
        ] as ThresoldsList,
        {
          selectedIndex: json.deflection.selectedIndex,
        },
      ),
    },
    force: {
      unit: units.force,
      choices: createSL(
        [
          createCustomThreshold(json.force.custom, units.force),
        ] as ThresoldsList,
        {
          selectedIndex: json.force.selectedIndex,
        },
      ),
    },
    distance: {
      unit: units.distance,
      choices: createSL(
        [
          createCustomThreshold(json.distance.custom, units.distance),
        ] as ThresoldsList,
        {
          selectedIndex: json.distance.selectedIndex,
        },
      ),
    },
    time: {
      unit: units.time,
      choices: createSL(
        [createCustomThreshold(json.time.custom, units.time)] as ThresoldsList,
        {
          selectedIndex: json.time.selectedIndex,
        },
      ),
    },
    percentage: {
      unit: units.percentage,
      choices: createSL(
        [
          createCustomThreshold(json.percentage.custom, units.percentage),
        ] as ThresoldsList,
        {
          selectedIndex: json.percentage.selectedIndex,
        },
      ),
    },
  }

  return thresholdsGroups
}

const upgradeJSON = (
  json: JSONMaxidynThresholdsConfigurationsVAny,
): JSONMaxidynThresholdsConfigurations => {
  switch (json.version) {
    case undefined:
    case 1:
    // upgrade
  }

  return json
}
