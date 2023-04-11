import {
  createCustomThreshold,
  createSelectableList,
  defaultThresholds,
} from '/src/scripts'

export const createHeavydynThresholdsGroupsFromJSON = (
  json: JSONHeavydynThresholdsConfigurationsVAny,
  units: HeavydynMathUnits
) => {
  json = upgradeJSON(json)

  console.log(json)

  const thresholdsGroups: HeavydynThresholdsGroups = {
    deflection: {
      unit: units.deflection,
      choices: createSelectableList(
        [
          ...defaultThresholds.deflection,
          createCustomThreshold(json.deflection.custom),
        ] as ThresoldsList,
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
    temperature: {
      unit: units.temperature,
      choices: createSelectableList(
        [createCustomThreshold(json.temperature.custom)] as ThresoldsList,
        {
          selectedIndex: json.temperature.selectedIndex,
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
    modulus: {
      unit: units.modulus,
      choices: createSelectableList(
        [createCustomThreshold(json.modulus.custom)] as ThresoldsList,
        {
          selectedIndex: json.modulus.selectedIndex,
        }
      ),
    },
    cumSum: {
      unit: units.cumSum,
      choices: createSelectableList(
        [createCustomThreshold(json.cumSum.custom)] as ThresoldsList,
        {
          selectedIndex: json.cumSum.selectedIndex,
        }
      ),
    },
    radius: {
      unit: units.radius,
      choices: createSelectableList(
        [createCustomThreshold(json.radius.custom)] as ThresoldsList,
        {
          selectedIndex: json.radius.selectedIndex,
        }
      ),
    },
  }

  return thresholdsGroups
}

const upgradeJSON = (
  json: JSONHeavydynThresholdsConfigurationsVAny
): JSONHeavydynThresholdsConfigurations => {
  switch (json.version) {
    case undefined:
    case 1: {
      const radius: JSONDistinctThresholdsConfiguration = {
        version: 1,
        selectedIndex: 0,
        custom: {
          version: 1,
          type: 'Bicolor',
          value: 0,
          valueHigh: 0,
        },
      }

      const jsonV2: JSONHeavydynThresholdsConfigurations = {
        ...json,
        version: 2,
        radius,
      }

      json = jsonV2
    }
  }

  return json
}
