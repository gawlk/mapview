import {
  createCustomThreshold,
  createSelectableList,
  defaultThresholds,
} from '/src/scripts'

export const createHeavydynThresholdsGroupsFromJSON = (
  json: JSONHeavydynThresholdsConfigurations,
  units: HeavydynMathUnits
) => {
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
  }

  return thresholdsGroups
}
