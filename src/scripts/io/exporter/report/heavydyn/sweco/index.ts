import dedent from 'dedent'

import {
  currentCategory,
  dayjsUtc,
  findFieldInArray,
  replaceAllLFToCRLF,
} from '/src/scripts'

import { ddToDms } from './coordinates'

export const heavydynSwecoExporter: HeavydynExporter = {
  name: '.fwd (Sweco)',
  export: (project: HeavydynProject) => {
    return new File(
      [
        replaceAllLFToCRLF(
          '\n' + writeHeader(project) + writePoints(project) + '\n'
        ),
      ],
      `${project.reports.selected?.name.toString() || ''}-sweco.fwd`,
      { type: 'text/plain' }
    )
  },
}

const writeSeparator = (): string => {
  return ''.padEnd(130, '_')
}

const padDotString = (str: string, length: number, tab = true): string => {
  const c = tab ? '\t' : ''
  return str.padEnd(length, '.') + c
}

const writeHeader = (project: HeavydynProject): string => {
  if (!project.reports.selected) {
    throw new Error('cannot find selected report ')
  }

  const date = dayjsUtc(
    findFieldInArray(project.reports.selected.information, 'Date')?.toString()
  ).format('DD/MM/YYYY')

  const fwdNumber = findFieldInArray(project.hardware, 'Serial number')?.value

  const rPlate = Math.round(project.calibrations.dPlate * 1000) / 2

  const sensors = project.calibrations.channels.slice(1)

  const lane = findFieldInArray(
    project.reports.selected.information,
    'Lane'
  )?.value

  const client = findFieldInArray(project.information, 'Client')?.value

  const roadReference = findFieldInArray(
    project.reports.selected.information,
    'Part'
  )?.value

  return dedent`
    ${writeSeparator()}\n\n
    (c) ROAD SYSTEM 2016, Metric
    ${writeSeparator()}
    $1
    ${padDotString('Filename:', 23) + project.name.value.toString()}
    ${padDotString('Client Code:', 23)}
    ${padDotString('Road number:', 23) + (lane?.toString() || '')}
    ${padDotString('Name of Client:', 23) + String(client?.toString())}
    ${padDotString('Districtnumber:', 23)}
    ${padDotString('Road reference:', 23) + (roadReference?.toString() || '')}
    ${padDotString('Start reference:', 23)}
    ${padDotString('Date [dd/mm/yy]:', 23) + date}
    ${padDotString('FWD Number:', 23) + (fwdNumber?.toString() || '')}
    ${padDotString('Load plate radius [mm]', 23) + rPlate.toString()}
    ${
      ' '.repeat(23) +
      '\t' +
      sensors.map((_, index) => `R(${index + 1})`).join('\t')
    }
    ${
      padDotString('Radial offset [cm]', 23) +
      sensors
        .map((channel) => Math.round(parseFloat(channel.position) * 100))
        .join('\t')
    }
    ${padDotString('Tolerance [%]', 23) + sensors.map(() => '5').join('\t')}
    ${padDotString('Correction [%]', 23) + sensors.map(() => '0').join('\t')}
    ${padDotString('Filter OFF:', 23)} - Hz
    \n\n
  `
}

const writePoints = (project: HeavydynProject): string => {
  if (!project.reports.selected) return ''

  return (
    project.reports.selected
      .getExportablePoints()
      .map((point) => {
        let coordinates = { lng: '', lat: '' }

        const chainage = Math.round(
          point.data.find((data) => data.label.name === 'Chainage')?.value
            .value || 0
        )

        coordinates = ddToDms(point.toBaseJSON().coordinates as mapboxgl.LngLat)

        const dropPosition = [
          'Position of Drop:',
          'Longitude: ' + coordinates.lng,
          'Latitude: ' + coordinates.lat,
          'Altitude: 0.0 m',
        ]

        return dedent`
          \n${writeSeparator()}
          $2
          ${padDotString('Chainage [m]', 23) + chainage.toString()}
          ${padDotString('Lane', 23)}
          ${padDotString('Pavement description', 23)}
          ${padDotString('Remarks', 23)}
          ${dropPosition.join('\t')}
          ${writeDrops(point, project.calibrations.channels)}
        `
      })
      .join('') || ''
  )
}

const writeDrops = (point: BasePoint, channels: JSONChannel[]): string => {
  const pointInfos = [
    'Sequence: 1/1',
    'No. of drops: ' + point.drops.length.toString(),
    'Fallheight: 0',
    'Time: ' + dayjsUtc(point.date).format('HH:mm'),
  ]
  const dropHeader = [
    'Drop',
    ...point.drops[0].data
      .filter(
        (data) =>
          data.label.unit === point.zone.report.project.units.deflection &&
          data.label.category === currentCategory
      )
      .map((_, index) => `D(${index + 1})`),
    'kPa',
    'kN',
    'Air',
    'Sur.',
    'Man.',
    'Pulse time',
  ]

  return dedent`
    ${writeSeparator()}
    $3
    ${pointInfos.join('\t')}
    
    ${dropHeader.join('\t')}
    ${point.drops.map((drop) => writeDrop(drop, channels)).join('\n')}
  `
}

const writeDrop = (drop: MachineDrop, channels: JSONChannel[]): string => {
  let str = ''

  const loadMax =
    drop.data
      .find(
        (data) =>
          data.label.unit === drop.point.zone.report.project.units.force &&
          data.label.category === currentCategory
      )
      ?.value.getValueAs('kN')
      .toFixed(1) || 0

  const maxValues = [
    drop.index.displayedIndex,
    ...drop.data
      .filter(
        (data) =>
          data.label.unit === drop.point.zone.report.project.units.deflection &&
          data.label.category === currentCategory
      )
      .map((_drop) => _drop.value.getValueAs('um').toFixed(1)),
    0,
    loadMax,
    ...drop.point.data
      .slice(0, -1)
      .map((data) =>
        data.value.getLocaleString({ precision: 1, locale: 'en-US' })
      ),
    (
      drop.data
        .find(
          (data) =>
            data.label.unit === drop.point.zone.report.project.units.time
        )
        ?.value.getValueAs('ms') || 0
    ).toFixed(2),
  ]

  str += `\n${maxValues.join('\t')}`

  if (drop.impactData) {
    const loadPosition = Math.round(parseFloat(channels[0].position) * 100)

    const loadInfos = [
      padDotString(`LoadCell (${loadPosition})[kN]`, 23, false),
      '-',
      loadMax,
      ...drop.impactData.load.map((value) => (value / 1000).toFixed(1)),
    ]

    str += `
      ${loadInfos.join('\t')}
      ${writeDisplacements(drop, channels)}
    `
  }

  return dedent`${str}`
}

const writeDisplacements = (
  drop: MachineDrop,
  channels: JSONChannel[]
): string => {
  if (!drop.impactData) {
    throw new Error('No impact data found')
  }

  return drop.impactData.displacement
    .map((displacement, index) => {
      const sensorName = 'Sensor' + (index + 1).toString().padStart(2, ' ')

      const sensorPosition = `(${Math.round(
        parseFloat(channels[index + 1].position) * 1000
      )
        .toString()
        .padStart(4, ' ')})`

      const sensorData = [
        sensorName + sensorPosition + '[MPa;µm].',
        1.0, // TODO
        drop.data[index + 2].value.getValueAs('um').toFixed(1),
        ...displacement.map((val) =>
          (val * 1000000).toFixed(1).replace('-0.0', '0.0')
        ),
      ]
      return sensorData.join('\t')
    })
    .join('\n')
}
