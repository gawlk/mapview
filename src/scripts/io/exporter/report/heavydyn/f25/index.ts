import dayjs from 'dayjs'
import dedent from 'dedent'
import { format } from 'mathjs'

import { findFieldInArray } from '/src/scripts'

// TODO:
// Everything is always in the same order, with same precision, spaces, etc
// Test: Compare if strings are a match

export const heavydynF25Exporter: HeavydynExporter = {
  name: '.F25',
  export: async (project: HeavydynProject) => {
    return new File(
      [
        dedent`
          ${writeHeader(project)}
          ${writeSensors(project)}
          ${writeEndHeader(project)}
          ${writePoints(project)}
        `,
      ],
      `${project.reports.selected?.name.toString().replaceAll(' ', '_')}.F25`,
      { type: 'text/plain' }
    )
  },
}

const writeHeader = (project: HeavydynProject): string => {
  const serialNumber = findFieldInArray(
    project.hardware,
    'Serial number'
  )?.toString()

  const operator = findFieldInArray(
    project.reports.selected!.information,
    'Operator'
  )?.toString()

  const sequenceName =
    project.reports.selected?.dataLabels.groups.list[0].sequenceName

  const date = dayjs(
    (
      project.information.find(
        (machineField: Field) => machineField.label === 'Date'
      )?.value as SelectableString
    ).value
  ).format('YYYY,MM,DD,HH,mm')

  return dedent`
    5001,25.99,1,40, 3, 1,"Heavydyn     "
    5002,"25SI ","${serialNumber?.padEnd(8, ' ')}","${serialNumber
    ?.toString()
    .padEnd(8, ' ')}"
    5003, "${operator?.padEnd(8, ' ')}", "${sequenceName?.padEnd(
    8,
    ' '
  )}", "${project.name.value.toString().padStart(8, ' ')}", "F25"
    5010,0,0,0,0,0,0,0,3,1,0,0,0,0,0,1,0,0,0,0,0,1,"MDB"
    5011,0,1,${date},0,"Non",000
    `
}

const writeEndHeader = (project: MachineProject): string => {
  const d = project.reports.selected?.line.sortedPoints
    .map((point) =>
      Number(
        point.data.find((pointData) => pointData.label.name === 'Chainage')
          ?.value.value
      )
    )
    .sort((a, b) => a - b)

  if (typeof d === 'undefined') {
    throw new Error()
  }

  let dmin = 0,
    dmax = 0
  if (d.length > 2) {
    dmin = Number(d[0]) * 1e-3
    dmax = Number(d[d.length - 1]) * 1e-3
  }

  if (!project.reports.selected) {
    throw new Error('cannot find selected report')
  }

  const operator = findFieldInArray(
    project.reports.selected.information,
    'Operator'
  )?.toString()

  const reportName = project.reports.selected?.name.value.toString()

  // TODO: zones length ?

  return dedent`
      5023,1,3,0,${dmin.toString().padStart(8, ' ')},${(
    Math.round(dmax * 1000) / 1000
  )
    .toString()
    .padStart(8, ' ')},${(Math.round(dmax * 1000) / 1000)
    .toString()
    .padStart(8, ' ')},   1.000,   0.000,1,1
      5024,1,1,0,1,1,1,     5, 2.0,     2, 2.0,1,1,0,  60
      5029,${d.length.toString().padStart(8, '0')},${(
    d.length * (project.reports.selected?.zones.length || 1)
  )
    .toString()
    .padStart(8, '0')},   28439,   84378
      5030,"${operator?.padEnd(32, ' ')}"
      5031,"${project.name.value.toString().padEnd(32, ' ')}"
      5032,"${reportName?.padEnd(32, ' ')}"
      5301,0,1,3,3,   6.000,1,1,        ,2018,07,25,10,22
      5302, 0, 1, 8, 0, 0, 0, 0, 0, "          "
      5303, 0, N0, 33.6, 27.3
      5041, "                "
      5042, "                "
      5043, "                "
      5044, "                "
    `
}

const writeSensors = (project: HeavydynProject): string => {
  const firstSensor = project.calibrations.channels.find(
    (channel) => channel.acquisition === 0
  )

  if (!firstSensor) {
    throw new Error('cant create sensors')
  }

  let sensorsString = dedent`
    5200,"${firstSensor.name.padEnd(8, ' ')}",2,1.000, ${formatExponential(
    firstSensor.gain,
    3
  )}, 0.00,  1.000\n
    `
  const nbrSensors = project.calibrations.channels.length - 1
  for (let i = 0; i < nbrSensors; i++) {
    sensorsString += dedent`
      ${5200 + i},"${project.calibrations.channels[i + 1].name.padEnd(
      8,
      ' '
    )}",1.000,${formatExponential(
      project.calibrations.channels[i + 1].gain,
      3
    )}\n 
      `
  }

  for (let i = nbrSensors; i < 19; i++)
    sensorsString += dedent`
    ${5200 + i},"NA      ",0,0.000,0.000\n
    `

  let s5020 = '5020,   150'
  for (let i = 1; i < nbrSensors + 1; i++)
    s5020 += `,${Math.round(
      Number(project.calibrations.channels[i].position) * 1000
    )
      .toString()
      .padStart(6, ' ')}`
  for (let i = nbrSensors; i < 19; i++) s5020 += ',N0    '

  sensorsString += dedent`
    ${s5020}
    5021,   300,     0,     0,     0,     0,     0,     0,     0,     0,     0,N0    ,N0    ,N0    ,N0    ,N0    ,N0    ,N0    ,N0    ,N0    
    5022,1,   0,   0,   50,  100,  200,  390,
    `
  return sensorsString
}

const writePoints = (project: HeavydynProject): string => {
  if (project.reports.selected) {
    return project.reports.selected?.line.sortedPoints
      .map((point) => {
        const header = dedent`
          ${writePointGps(point)}
          ${writePointHeader(
            point as HeavydynPoint,
            project.reports.selected as HeavydynReport
          )}
        `
        const values = writeDrops(point, project.calibrations.dPlate)

        return `${header}${values}\n`
      })
      .join('')
  } else throw new Error()
}

const writePointGps = (point: BasePoint) => {
  return dedent`
    5280,0,140418.0,${point.marker
      ?.getLngLat()
      .lat.toFixed(8)
      .padStart(12, ' ')},${point.marker
    ?.getLngLat()
    .lng.toFixed(8)
    .padStart(12, ' ')},${Number('1')
    .toFixed(2)
    .padStart(8, ' ')}, 2,18,   0,  0 
    `
}

const writePointHeader = (
  point: HeavydynPoint,
  report: HeavydynReport
): string => {
  const date = dayjs(point.date).format('YYYY, MM, DD, HH, mm')

  let chainage = point.data.find(
    (pointData) => pointData.label.name === 'Chainage'
  )?.value.value
  if (typeof chainage === 'undefined') throw new Error()
  chainage = Math.round(chainage)

  const comment = findFieldInArray(report.information, 'Comment')?.toString()

  const tair = point.data.find((pointData) => pointData.label.name === 'Tair')
    ?.value.value

  const tsurf = point.data.find((pointData) => pointData.label.name === 'Tsurf')
    ?.value.value

  const tman = point.data.find((pointData) => pointData.label.name === 'Tman')
    ?.value.value

  if (
    typeof tair === 'undefined' ||
    typeof tsurf === 'undefined' ||
    typeof tman === 'undefined'
  )
    throw new Error()

  return dedent`
    5301,0,1,3,3,${chainage.toString().padStart(7, ' ')},1,1,        ,${date}
    5302, 0, 1, 8, 0, 0, 0, 0, 0, "${comment?.toString().padStart(55, ' ')}"
    5303,0,${(Math.round(tman * 10) / 10)
      .toPrecision(2)
      .toString()
      .padStart(5, ' ')},${(Math.round(tsurf * 10) / 10)
    .toString()
    .padStart(5, ' ')},${(Math.round(tair * 10) / 10)
    .toString()
    .padStart(5, ' ')}
    `
}

const writeDrops = (point: BasePoint, dPlate: number): string => {
  return point.drops
    .map((drop) => {
      const nbr = drop.index.displayedIndex.toString().padStart(3, ' ')
      const force =
        ((drop.data[1].value.value * 1e-3) / Math.PI / dPlate / dPlate) * 4
      let values = ''
      for (let i = 2; i < drop.data.length; i++) {
        let value: string | number = drop.data[i].value.getValueAs('um')
        const precision = value < 1000 ? 1 : 0
        value = value.toFixed(precision)
        if (Number(value) <= 0) value = 0.1
        values += `,${value.toString().padStart(6, ' ')}`
      }
      const valuesString = dedent`
            ,${Math.round(force).toString().padStart(6, ' ')}${values}
          `
      return `\n${nbr}${valuesString}`
    })
    .join('')
}

const formatExponential = (n: number, pad: number): string => {
  const splitedNumber = format(n, {
    precision: 4,
    notation: 'exponential',
  }).split('e')

  let exponential = splitedNumber[1].split('')
  exponential[1] = exponential[1].toString().padStart(3, '0')
  return `${splitedNumber[0]}e${exponential.join('')}`.toUpperCase()
}