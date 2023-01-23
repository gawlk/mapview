import { createMathUnit } from '/src/scripts'

export const createHeavydynMathUnitsFromJSON = (
  json: JSONHeavydynUnits
): HeavydynMathUnits => {
  return {
    deflection: createMathUnit('Deflection', json.deflection, 'm', [
      ['mm', 0],
      ['1/100 mm', 0],
      ['um', 0],
    ]),
    modulus: createMathUnit('Modulus', json.modulus, 'Pa', [['MPa', 2]]),
    force: createMathUnit('Force', json.force, 'N', [
      ['N', 0],
      ['kN', 0],
      ['lbs', 0],
    ]),
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
      }
    ),
  }
}
