import { shallowReactive, watch } from 'vue'
import { createLine } from '../map/line'
import { addDummyLayersToMap } from '../map/map'
import { createPoint } from '../map/point'
import { createMathNumber } from '../math/mathNumber'
import { createMathUnit } from '../math/mathUnit'
import { createReport } from './report'

export const createProject = (name: string, map: mapboxgl.Map): Project => {
  addDummyLayersToMap(map)

  const unitDeformation = createMathUnit(
    'Deformation',
    [
      ['mm', 0],
      ['1/100 mm', 0],
      ['um', 0],
    ],
    {
      minDisplayedValue: 100,
      maxDisplayedValue: 200,
    }
  )

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

  point.finalData.D0 = createMathNumber(100, unitDeformation)
  point.finalData.F0 = createMathNumber(100, unitForce)
  point.finalData.T0 = createMathNumber(100, unitTemperature)
  point.finalData.P0 = createMathNumber(100, '%')

  const point2 = createPoint(
    2,
    {
      lat: map.getCenter().lat + 0.05,
      lng: map.getCenter().lng + 0.05,
    },
    map
  )

  point2.finalData.D0 = createMathNumber(400, unitDeformation)
  point2.finalData.F0 = createMathNumber(400, unitForce)
  point2.finalData.T0 = createMathNumber(400, unitTemperature)
  point2.finalData.P0 = createMathNumber(400, '%')

  const points = [point, point2]

  const line = createLine(points, map)

  const report = createReport('test report', map, points, line, {
    keys: ['D0', 'F0', 'T0', 'P0'],
    selected: 'D0',
  })

  const project: Project = shallowReactive({
    name,
    reports: [report],
    selectedReport: report,
    images: [],
    units,
    arePointsLinked: true,
    arePointsLocked: true,
    arePointsVisible: true,
    areImagesVisible: true,
    pointsState: 'number' as PointState,
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
        if (report.isVisible) {
          arePointsLinked ? report.line?.addToMap() : report.line?.remove()
        }
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
        if (report.isVisible) {
          report.points.forEach((point) => {
            if (arePointsVisible && point.isVisible) {
              point.marker.addTo(map)
            } else {
              point.marker.remove()
            }
          })
        }
      })
    }
  )

  watch(
    () => project.areImagesVisible,
    (areImagesVisible: boolean) => {
      project.images.forEach((image: ImageMap) => {
        if (areImagesVisible && image.isVisible) {
          image.addToMap()
        } else {
          image.remove()
        }
      })
    }
  )

  watch(
    () => project.pointsState,
    (pointsState: PointState) => {
      project.reports.forEach((report: Report) => {
        report.points.forEach((point) => {
          point.state = pointsState
        })
      })
    }
  )

  map.on('style.load', () => {
    addDummyLayersToMap(map)

    if (project.arePointsLinked) {
      project.reports.forEach((report) => {
        report.line.addToMap()
      })
    }

    if (project.areImagesVisible) {
      project.images.forEach((image) => {
        if (image.isVisible) {
          image.addToMap()
        }
      })
    }
  })

  return project
}
