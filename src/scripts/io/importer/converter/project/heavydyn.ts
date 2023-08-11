import { run } from '/src/scripts'

import { convertPRJZToHeavydynReport } from '../report'

export const convertPRJZToHeavydynProject = (
  json: JSONAny,
  baseProject: JSONBaseProject,
): JSONHeavydynProject => {
  const project: JSONHeavydynProject = {
    version: 1,
    machine: 'Heavydyn',
    base: baseProject,
    distinct: convertPRJZToHeavydynProjectDistinct(json),
  }

  project.base.reports.list.push(
    ...json.PVs.map(
      (jsonPV: RecordAny, index: number): JSONHeavydynReport =>
        convertPRJZToHeavydynReport(jsonPV, index, json),
    ),
  )

  project.base.reports.selectedIndex = project.base.reports.list.length
    ? 0
    : null

  return project
}

export const convertPRJZToHeavydynProjectDistinct = (
  json: JSONAny,
): JSONHeavydynProjectDistinct => {
  const units = convertPRJZToHeavydynUnits(json)

  return {
    version: 1,
    units,
    correctionParameters: {
      version: 1,
      load: {
        version: 2,
        active: false,
        source: 'Sequence',
        customValue: 65000,
      },
      temperature: {
        version: 2,
        active: false,
        source: 'Tair',
        average: 'Zone',
        customValue: 0,
        reference: 15,
        structureType: 0,
      },
    },
    calibrations: {
      version: 1,
      date: json.Calibrations.Date,
      dPlate: json.Calibrations.Dplate,
      channels:
        json.Calibrations.Channels.map((channel: RecordAny): JSONChannel => {
          return {
            version: 1,
            name: channel.Name,
            position: channel.Position,
            gain: channel.Gain,
            acquisition: channel.ChannelAcqu,
            type: channel.Type,
            v0: channel.V0,
          }
        }) || [],
      sensors:
        json.Calibrations.Sensors.map((sensor: RecordAny): JSONSensor => {
          return {
            version: 1,
            name: sensor.Name,
            gain: sensor.Gain,
            type: sensor.Type,
            v0: sensor.V0,
          }
        }) || [],
    },
  }
}

export const convertPRJZToHeavydynUnits = (json: JSONAny) => {
  const units: JSONHeavydynUnits = {
    version: 2,
    deflection: {
      version: 1,
      currentUnit: run((): PossibleHeavydynDeflectionUnits => {
        switch (
          (json.ExportedData.Drops as RecordAny[]).find(
            (exportedUnit) => exportedUnit.Type === 'Deflection',
          )?.Unit
        ) {
          case 'mm':
            return 'mm'
          case 'um':
            return 'um'
          default:
            return '1/100 mm'
        }
      }),
      currentPrecision: 0,
      max: 0.003,
    },
    force: {
      version: 1,
      currentUnit: run((): PossibleHeavydynForceUnits => {
        switch (
          (json.ExportedData.Drops as RecordAny[]).find(
            (exportedUnit) => exportedUnit.Type === 'Load',
          )?.Unit
        ) {
          case 'N':
            return 'N'
          default:
            return 'kN'
        }
      }),
      currentPrecision: 0,
      max: 500000,
    },
    distance: {
      version: 1,
      currentUnit: run((): PossibleHeavydynDistanceUnits => {
        switch (
          (json.ExportedData.Points as RecordAny[]).find(
            (exportedUnit) => exportedUnit.Type === 'Distance',
          )?.Unit
        ) {
          case 'km':
            return 'km'
          case 'mi':
            return 'mi'
          default:
            return 'm'
        }
      }),
      currentPrecision: 0,
      max: 100000,
    },
    time: {
      version: 1,
      currentUnit: run((): PossibleHeavydynTimeUnits => {
        switch (
          (json.ExportedData.Drops as RecordAny[]).find(
            (exportedUnit) => exportedUnit.Type === 'Time',
          )?.Unit
        ) {
          case 's':
            return 's'
          case 'us':
            return 'us'
          default:
            return 'ms'
        }
      }),
      currentPrecision: 0,
      max: 0.1,
    },
    temperature: {
      version: 1,
      currentUnit: run((): PossibleHeavydynTemperatureUnits => {
        switch (
          (json.ExportedData.Points as RecordAny[]).find(
            (exportedUnit) => exportedUnit.Type === 'Temperature',
          )?.Unit
        ) {
          case 'K':
            return 'K'
          case 'degF':
          case '°F':
            return '°F'
          default:
            return '°C'
        }
      }),
      currentPrecision: 0,
      min: -50,
      max: 150,
    },
    modulus: {
      version: 1,
      currentUnit: 'MPa',
      currentPrecision: 0,
      max: 100000000000,
    },
    cumSum: {
      version: 1,
      currentUnit: '',
      currentPrecision: 0,
      max: 100,
    },
    radius: {
      version: 1,
      currentUnit: 'm',
      currentPrecision: 0,
      max: 2000,
    },
  }

  return units
}
