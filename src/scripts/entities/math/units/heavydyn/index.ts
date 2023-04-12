import { createMathUnit } from '/src/scripts'

export const createHeavydynMathUnitsFromJSON = (
  json: JSONHeavydynUnitsVAny
): HeavydynMathUnits => {
  json = upgradeJSON(json)

  return {
    deflection: createMathUnit(
      'Deflection',
      json.deflection,
      'm',
      [
        ['mm', 0],
        ['1/100 mm', 0],
        ['um', 0],
      ],
      {
        isValid: (value) => value >= 0,
      }
    ),
    modulus: createMathUnit('Modulus', json.modulus, 'Pa', [['MPa', 2]]),
    force: createMathUnit(
      'Force',
      json.force,
      'N',
      [
        ['N', 0],
        ['kN', 0],
        ['lbs', 0],
      ],
      {
        isValid: (value) => value >= 0,
      }
    ),
    temperature: createMathUnit('Temperature', json.temperature, '°C', [
      ['°C', 0],
      ['°F', 0],
      ['K', 0],
    ]),
    distance: createMathUnit('Distance', json.distance, 'm', [
      ['m', 0],
      ['km', 0],
      ['mi', 0],
    ]),
    time: createMathUnit(
      'Time',
      json.time,
      's',
      [
        ['s', 0],
        ['ms', 0],
        ['us', 0],
      ],
      {
        step: 0.1,
        isValid: (value) => value >= 0,
      }
    ),
    cumSum: createMathUnit(
      'CumSum',
      {
        version: 1,
        currentUnit: '',
        currentPrecision: 1,
        min: -100,
        max: 100,
      },
      '',
      [['', 1]],
      {
        step: 0.1,
        readOnly: true,
      }
    ),
    radius: createMathUnit(
      'Radius',
      json.radius,
      'm',
      [
        ['m', 0],
        ['km', 0],
        ['mi', 0],
      ],
      {
        isValid: (value) => value >= 0,
      }
    ),
  }
}

const upgradeJSON = (json: JSONHeavydynUnitsVAny): JSONHeavydynUnits => {
  switch (json.version) {
    case undefined:
    case 1: {
      const radius: JSONMathUnit<PossibleHeavydynRadiusUnits> = {
        version: 1,
        currentUnit: 'm',
        currentPrecision: 0,
        max: 2000,
      }

      const jsonV2: JSONHeavydynUnits = {
        ...json,
        version: 2,
        radius,
      }

      json = jsonV2
    }
  }

  return json
}
