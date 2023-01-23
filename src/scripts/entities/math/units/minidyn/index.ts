import { createMathUnit } from '/src/scripts'

export const createMinidynMathUnitsFromJSON = (
  json: JSONMinidynUnits
): MinidynMathUnits => {
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