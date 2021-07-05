import { shallowReactive } from 'vue'
import { Map } from 'mapbox-gl'

import { createReport } from './report'
import { createPoint } from '../map/point'
import { createMathUnit } from '../math/mathUnit'
import { createMathNumber } from '../math/mathNumber'
import { createSimpleNumber } from '../math/simpleNumber'

export const createProject = (name: string, map: Map): Project => {
  const report = createReport('test report', {
    keys: ['D0', 'F0', 'T0', 'P0'],
  })

  const point = createPoint(1, map.getCenter(), map)

  const unitDeformation = createMathUnit('Deformation', [
    ['mm', 0],
    ['um', 0],
    ['1/100 mm', 0],
  ])

  const unitForce = createMathUnit('Force', [
    ['N', 0],
    ['kN', 0],
    ['lbs', 0],
  ])

  const unitTemperature = createMathUnit('Temperature', [
    ['K', 0],
    ['degC', 0],
    ['degF', 0],
  ])

  const units = [unitDeformation, unitForce, unitTemperature]

  point.finalData = {
    D0: createMathNumber(100, unitDeformation),
    F0: createMathNumber(100, unitForce),
    T0: createMathNumber(100, unitTemperature),
    P0: createSimpleNumber(100, '%'),
  }

  report.points = [point]

  return shallowReactive({
    name,
    reports: [report],
    selectedReport: report,
    images: [],
    units,
    pointsLinked: true,
    pointsLocked: true,
    pointsVisible: true,
    pointsText: 'value',
    // pointsIcon: 1,
    database: undefined,
    informations: [
      {
        name: 'String',
        value: 'string',
      },
      {
        name: 'Number',
        value: 1,
      },
      {
        name: 'Slidable number',
        value: {
          kind: 'slidableNumber',
          value: 50,
          step: 5,
          min: 10,
          max: 1000,
        },
      },
      {
        name: 'Date',
        value: {
          kind: 'date',
          value: '2021-01-01',
        },
      },
      {
        name: 'Long string',
        value: {
          kind: 'longString',
          value: 'ioeshnteosih',
        },
      },
      {
        name: 'Selectable string',
        value: {
          kind: 'selectableString',
          value: 'value',
          strict: false,
          possibleValues: ['valeur 1', 'valeur 2', 'valeur 3'],
        },
      },
    ],
    configurations: [
      {
        name: 'Selectable string',
        value: {
          kind: 'selectableString',
          strict: true,
          value: 'value 1',
          possibleValues: ['valeur 1', 'valeur 2', 'valeur 3'],
        },
      },
    ],
  })
}
