import dedent from 'dedent'
import { filterExportablePointsFromReport } from 'src/scripts'

import {
  currentCategory,
  findFieldInArray,
  replaceAllLFToCRLF,
} from '/src/scripts'

import { dayjsUtc } from '/src/utils/date/dayjs'

export const heavydynDynatestExporter: HeavydynExporter = {
  name: '.fwd (Dynatest)',
  export: (project: HeavydynProject) => {
    return new File(
      [
        replaceAllLFToCRLF(
          `${writeHeader(project)}\n${writeEndHeader()}\n${
            writePoints(project)
              ?.map((pointData) => pointData.join('\n'))
              .join('\n') || ''
          }`
            .split('\n')
            .map((line) => line.padEnd(80, ' '))
            .join('\n')
        ),
      ],
      `${project.reports.selected?.name.toString() || ''}-dynatest.fwd`,
      { type: 'text/plain' }
    )
  },
}

const writeSensors = (project: HeavydynProject): string[] => {
  const sections = []
  const startIndex = project.calibrations.channels
    .slice(1, project.calibrations.channels.length)
    .findIndex((sensor) => Number(sensor.position) >= 0)

  const firstsSensors = project.calibrations.channels.slice(
    startIndex + 1,
    startIndex + 8
  )
  firstsSensors.unshift(project.calibrations.channels[0])

  sections.push(
    `${firstsSensors
      .map((sensor) =>
        Math.round(Number(sensor.position) * 1000)
          .toString()
          .padStart(4, ' ')
      )
      .join('')}${firstsSensors
      .map((sensor) =>
        (Number(sensor.position) * 0.0393701)
          .toFixed(2)
          .toString()
          .padStart(6, ' ')
      )
      .join('')}`
  )

  sections.push(
    firstsSensors
      .map((sensor, index) => {
        const name = index === 0 ? 'Ld' : `D${index}`
        return dedent`
          ${name} ${sensor.name.slice(
          sensor.name.length - 3,
          sensor.name.length
        )} 1.000 ${sensor.gain.toFixed(2)}
        `
      })
      .join('\n')
  )

  return sections
}

const writeHeader = (project: HeavydynProject) => {
  const stringArray = []
  const serialNumber = findFieldInArray(
    project.hardware,
    'Serial number'
  )?.toString()

  const sensorsSection = writeSensors(project)

  if (!project.reports.selected)
    throw new Error("can't access selected project")

  stringArray.push(dedent`
      R80    102    ${project.name.value}
      70103300${serialNumber}69994.3703111  1
    `)

  stringArray.push(sensorsSection[0])

  stringArray.push(
    '   R  D1  D2  D3  D4  D5  D6  D7     R    D1    D2    D3    D4    D5    D6    D7'
  )

  stringArray.push(`C:\\${project.reports.selected.name.value.toString()}`)

  const points = writePoints(project)
  if (!points) throw new Error("can't access first and last point")

  stringArray.push(points[0][1])
  stringArray.push(points[points.length - 1][1])

  stringArray.push(dedent`
      12394260276336160       .302
      8   15  3.5 15  3   20  3   10
    `)

  stringArray.push(sensorsSection[1])

  return stringArray.join('\n')
}

const writeEndHeader = () => {
  return dedent`
      D0NA 0.0000.000
      D0NA 0.0000.000                                                            
      D0NA 0.0000.000
      D0NA 0.0000.000                                                             
      *                                                                               
      11110011........................                                                
      13.82   2.5 2    ...............                                                
      *                                                                               
      *                                                                               
      *                                                                               
      *000+0.0 000+0.0 st                                                             
      ................................                                                
                          0   0Peak...32  0   ......                                  
      123.............................................................................
      11111111111111111111111111111111111111111111111111111111111111111111111111111111
      ................................................................................
      ********************************************************************************
      ................................................................................
      ................................................................................
      *                                                                               
      *                                                
    `
}

const writePointGPS = (point: BasePoint) => {
  const { lng, lat } = point.toBaseJSON().coordinates as LngLat
  return `G0000001+${lat}+${lng}999.9`
}

const writePoints = (project: HeavydynProject) => {
  if (!project.reports.selected) return []

  return filterExportablePointsFromReport(project.reports.selected).map(
    (point) => {
      const celsiusDegreesTemps = point.data
        .filter((data) => data.label.unit === project.units.temperature)
        .map((data, index) => {
          const precision = index === 0 ? 1 : 0
          const value = data.getRawValue().toFixed(precision)
          if (index === 0) {
            return value.padStart(4, ' ')
          }

          return value.padStart(2, ' ')
        })

      const fahrenheitDegreesTemps = point.data
        .slice(0, 3)
        .map((data) => {
          return data.value
            .getLocaleString({ unit: 'degF', locale: 'en-US' })
            .padStart(4, ' ')
        })
        .join(' ')

      const chainage = Number(
        point.data
          .find((pointData) => pointData.label.name === 'Chainage')
          ?.getRawValue()
      )
        .toFixed(2)
        .padStart(8, ' ')

      return [
        `${writePointGPS(point)}`,
        `S ${chainage} ${celsiusDegreesTemps[0]}00 ${celsiusDegreesTemps[1]} ${
          celsiusDegreesTemps[2]
        }I2${dayjsUtc(point.date).format('HHmm')} ${fahrenheitDegreesTemps}`,
        `${writeDrops(point, project.calibrations.dPlate)}`,
      ]
    }
  )
}

const writeDrops = (point: BasePoint, dPlate: number) => {
  return point.drops
    .map((drop) => {
      const values = drop.data
        .filter(
          (data) =>
            data.label.unit === point.zone.report.project.units.deflection &&
            data.label.category === currentCategory
        )
        .map((data) => {
          let value: string | number = data.value.getValueAs('um')
          value = value.toFixed(2)
          if (Number(value) <= 0) value = 0.1
          return value.toString().padStart(4, ' ')
        })

      const power =
        (((drop.data
          .find(
            (data) =>
              data.label.unit === point.zone.report.project.units.force &&
              data.label.category === currentCategory
          )
          ?.getRawValue() || 0) *
          1e-3) /
          Math.PI /
          dPlate /
          dPlate) *
        4
      values.unshift(power.toFixed(2).toString().padStart(4, ' '))

      return dedent`
          ${values.join('')} 
        `
    })
    .join('\n')
}
