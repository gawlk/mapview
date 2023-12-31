import {
  createCustomThreshold,
  createDefaultDeflectionThresholds,
  createSL,
} from '/src/scripts'

export const createHeavydynThresholdsGroupsFromJSON = (
  json: JSONHeavydynThresholdsConfigurationsVAny,
  units: HeavydynMathUnits,
) => {
  json = upgradeJSON(json)

  const thresholdsGroups: HeavydynThresholdsGroups = {
    deflection: {
      unit: units.deflection,
      choices: createSL(
        [
          createCustomThreshold(json.deflection.custom, units.deflection),
          ...createDefaultDeflectionThresholds(units.deflection),
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
    temperature: {
      unit: units.temperature,
      choices: createSL(
        [
          createCustomThreshold(json.temperature.custom, units.temperature),
        ] as ThresoldsList,
        {
          selectedIndex: json.temperature.selectedIndex,
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
    modulus: {
      unit: units.modulus,
      choices: createSL(
        [
          createCustomThreshold(json.modulus.custom, units.modulus),
        ] as ThresoldsList,
        {
          selectedIndex: json.modulus.selectedIndex,
        },
      ),
    },
    cumSum: {
      unit: units.cumSum,
      choices: createSL(
        [
          createCustomThreshold(json.cumSum.custom, units.cumSum),
        ] as ThresoldsList,
        {
          selectedIndex: json.cumSum.selectedIndex,
        },
      ),
    },
    radius: {
      unit: units.radius,
      choices: createSL(
        [
          createCustomThreshold(json.radius.custom, units.radius),
        ] as ThresoldsList,
        {
          selectedIndex: json.radius.selectedIndex,
        },
      ),
    },
  }

  return thresholdsGroups
}

const upgradeJSON = (
  json: JSONHeavydynThresholdsConfigurationsVAny,
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
