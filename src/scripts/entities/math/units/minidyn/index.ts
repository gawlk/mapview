import { createMathUnit } from '/src/scripts'

export const createMinidynMathUnitsFromJSON = (
  json: JSONMinidynUnitsVAny,
): MinidynMathUnits => {
  json = upgradeJSON(json)

  const modulus = createMathUnit('Modulus', json.modulus, 'Pa', [['MPa', 0]], {
    averageFunction: 'capOutliers',
  })

  const stiffness = createMathUnit(
    'Stiffness',
    json.stiffness,
    'N / m',
    [['MN / m', 0]],
    {
      averageFunction: 'capOutliers',
    },
  )

  const deflection = createMathUnit(
    'Deflection',
    json.deflection,
    'm',
    [
      ['mm', 0],
      ['um', 0],
    ],
    {
      checkValidity: (value) => value >= 0,
    },
  )

  const force = createMathUnit(
    'Force',
    json.force,
    'N',
    [
      ['N', 0],
      ['kN', 0],
    ],
    {
      checkValidity: (value) => value >= 0,
    },
  )

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
      checkValidity: (value) => value >= 0,
    },
  )

  const percentage = createMathUnit(
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
      invalidReplacement: '0',
    },
  )

  return {
    deflection,
    distance,
    force,
    modulus,
    percentage,
    stiffness,
    time,
    list: [modulus, stiffness, deflection, force, distance, time, percentage],
    toJSON() {
      return {
        version: 1,
        deflection: this.deflection.toJSON(),
        force: this.force.toJSON(),
        distance: this.distance.toJSON(),
        modulus: this.modulus.toJSON(),
        percentage: this.percentage.toJSON(),
        stiffness: this.stiffness.toJSON(),
        time: this.time.toJSON(),
      }
    },
  }
}

const upgradeJSON = (json: JSONMinidynUnitsVAny): JSONMinidynUnits => {
  switch (json.version) {
    case undefined:
    case 1:
  }

  return json
}
