import { shallowReactive, watch } from 'vue'

import { createReport } from './report'
import { createLine } from '../map/line'
import { createPoint } from '../map/point'
import { createMathUnit } from '../math/mathUnit'
import { createMathNumber } from '../math/mathNumber'

export const createProject = (name: string, map: mapboxgl.Map): Project => {
  const report = createReport('test report', {
    keys: ['D0', 'F0', 'T0', 'P0'],
  })

  const unitDeformation = createMathUnit('Deformation', [
    ['mm', 0],
    ['1/100 mm', 0],
    ['um', 0],
  ])

  const unitForce = createMathUnit('Force', [
    ['N', 0],
    ['kN', 0],
    ['lbs', 0],
  ])

  const unitTemperature = createMathUnit('Temperature', [
    ['degC', 0],
    ['degF', 0],
    ['K', 0],
  ])

  const units = [unitDeformation, unitForce, unitTemperature]

  const point = createPoint(1, map.getCenter(), map)

  point.finalData = {
    D0: createMathNumber(100, unitDeformation),
    F0: createMathNumber(100, unitForce),
    T0: createMathNumber(100, unitTemperature),
    P0: createMathNumber(100, '%'),
  }

  const point2 = createPoint(
    2,
    {
      lat: map.getCenter().lat + 0.05,
      lng: map.getCenter().lng + 0.05,
    },
    map
  )

  point2.finalData = {
    D0: createMathNumber(200, unitDeformation),
    F0: createMathNumber(200, unitForce),
    T0: createMathNumber(200, unitTemperature),
    P0: createMathNumber(200, '%'),
  }

  report.points = [point, point2]

  report.line = createLine(report.points, map)

  const project = shallowReactive({
    name,
    reports: [report],
    selectedReport: report,
    images: [],
    units,
    arePointsLinked: true,
    arePointsLocked: true,
    arePointsVisible: true,
    pointsState: 'number' as PointsState,
    // pointsIcon: 1,
    database: undefined,
    informations: [
      {
        name: 'String',
        value: 'string',
      } as Field,
      {
        name: 'Number',
        value: 1,
      } as Field,
      {
        name: 'Slidable number',
        value: {
          kind: 'slidableNumber',
          value: 50,
          step: 5,
          min: 10,
          max: 1000,
        },
      } as Field,
      {
        name: 'Date',
        value: {
          kind: 'date',
          value: '2021-01-01',
        },
      } as Field,
      {
        name: 'Long string',
        value: {
          kind: 'longString',
          value: 'ioeshnteosih',
        },
      } as Field,
      {
        name: 'Selectable string',
        value: {
          kind: 'selectableString',
          value: 'value',
          strict: false,
          possibleValues: ['valeur 1', 'valeur 2', 'valeur 3'],
        },
      } as Field,
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
      } as Field,
    ],
  })

  watch(
    () => project.arePointsLinked,
    (arePointsLinked: boolean) => {
      project.reports.forEach((report: Report) => {
        arePointsLinked ? report.line?.addToMap() : report.line?.remove()
      })
    }
  )

  watch(
    () => project.arePointsLocked,
    (arePointsLocked: boolean) => {
      project.reports.forEach((report: Report) => {
        report.points.forEach((point) => {
          point.marker.setDraggable(!arePointsLocked)
        })
      })
    }
  )

  watch(
    () => project.arePointsVisible,
    (arePointsVisible: boolean) => {
      project.reports.forEach((report: Report) => {
        report.points.forEach((point) => {
          if (arePointsVisible) {
            point.marker.addTo(map)
          } else {
            point.marker.remove()
          }
        })
      })
    }
  )

  watch(
    () => project.pointsState,
    (pointsState: PointsState) => {
      project.reports.forEach((report: Report) => {
        report.points.forEach((point) => {
          switch (pointsState) {
            case 'number':
              point.icon.setText(String(point.number))
              break
            case 'value':
              point.icon.setText(point.finalData['D0'].displayString)
              break
            case 'nothing':
              point.icon.setText('')
              break
          }
        })
      })
    }
  )

  return project
}
