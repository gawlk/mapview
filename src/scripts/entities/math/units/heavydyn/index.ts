import { createMathUnit } from '/src/scripts'

export const createHeavydynMathUnitsFromJSON = (
  json: JSONHeavydynUnitsVAny,
): HeavydynMathUnits => {
  json = upgradeJSON(json)

  const deflection = createMathUnit(
    'Deflection',
    json.deflection,
    'm',
    [
      ['mm', 0],
      ['1/100 mm', 0],
      ['um', 0],
    ],
    {
      checkValidity: (value) => value >= 0,
    },
  )

  const modulus = createMathUnit('Modulus', json.modulus, 'Pa', [['MPa', 2]])

  const force = createMathUnit(
    'Force',
    json.force,
    'N',
    [
      ['N', 0],
      ['kN', 0],
      ['lbs', 0],
    ],
    {
      checkValidity: (value) => value >= 0,
    },
  )

  const temperature = createMathUnit('Temperature', json.temperature, '°C', [
    ['°C', 0],
    ['°F', 0],
    ['K', 0],
  ])

  const distance = createMathUnit('Distance', json.distance, 'm', [
    ['m', 0],
    ['km', 0],
    ['mi', 0],
  ])

  const time = createMathUnit(
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
      checkValidity: (value) => value >= 0,
    },
  )

  const cumSum = createMathUnit(
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
    },
  )

  const radius = createMathUnit(
    'Radius',
    json.radius,
    'm',
    [
      ['m', 0],
      ['km', 0],
      ['mi', 0],
    ],
    {
      checkValidity: (value) => value >= 0,
    },
  )

  return {
    cumSum,
    deflection,
    distance,
    force,
    modulus,
    radius,
    temperature,
    time,
    list: [
      deflection,
      modulus,
      force,
      temperature,
      distance,
      time,
      cumSum,
      radius,
    ],
    toJSON() {
      return {
        version: 2,
        deflection: this.deflection.toJSON(),
        distance: this.distance.toJSON(),
        force: this.force.toJSON(),
        temperature: this.temperature.toJSON(),
        time: this.time.toJSON(),
        modulus: this.modulus.toJSON(),
        cumSum: this.cumSum.toJSON(),
        radius: this.radius.toJSON(),
      }
    },
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
