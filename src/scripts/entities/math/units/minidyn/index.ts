import { createMathUnit } from '/src/scripts'

export const createMinidynMathUnitsFromJSON = (
  json: JSONMinidynUnitsVAny
): MinidynMathUnits => {
  json = upgradeJSON(json)

  return {
    modulus: createMathUnit('Modulus', json.modulus, 'Pa', [['MPa', 0]], {
      averageFunction: 'capOutliers',
    }),
    stiffness: createMathUnit(
      'Stiffness',
      json.stiffness,
      'N / m',
      [['MN / m', 0]],
      {
        averageFunction: 'capOutliers',
      }
    ),
    deflection: createMathUnit('Deflection', json.deflection, 'm', [
      ['mm', 0],
      ['um', 0],
    ]),
    force: createMathUnit('Force', json.force, 'N', [
      ['N', 0],
      ['kN', 0],
    ]),
    distance: createMathUnit('Distance', json.distance, 'm', [
      ['m', 0],
      ['km', 0],
      ['mi', 0],
    ]),
    time: createMathUnit('Time', json.time, 's', [
      ['s', 0],
      ['ms', 0],
      ['us', 0],
    ]),
    percentage: createMathUnit(
      'Percentage',
      {
        version: 1,
        currentUnit: '%',
        currentPrecision: 0,
        max: 100,
      },
      '%',
      [['%', 0]],
      {
        step: 0.5,
        readOnly: true,
      }
    ),
  }
}

const upgradeJSON = (json: JSONMinidynUnitsVAny): JSONMinidynUnits => {
  switch (json.version) {
    case undefined:
    case 1:
    // upgrade
    default:
      json = json as JSONMinidynUnits
  }

  return json
}
