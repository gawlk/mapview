import { convertPRJZToHeavydynReport } from '../report'

export const convertPRJZToHeavydynProject = (
  json: any,
  baseProject: JSONBaseProject
): JSONHeavydynProject => {
  const project: JSONHeavydynProject = {
    version: 1,
    base: baseProject,
    distinct: convertPRJZToHeavydynProjectDistinct(json),
  }

  project.base.information.push({
    version: 1,
    label: 'Sequence',
    value: json.Sequences.Name,
    settings: {
      version: 1,
    },
  })

  project.base.reports.list.push(
    ...json.PVs.map(
      (jsonPV: any, index: number): JSONHeavydynReport =>
        convertPRJZToHeavydynReport(jsonPV, index, json)
    )
  )
  project.base.reports.selected = project.base.reports.list.length ? 0 : null

  return project
}

export const convertPRJZToHeavydynProjectDistinct = (
  json: any
): JSONHeavydynProjectDistinct => {
  const units = convertPRJZToHeavydynUnits(json)

  return {
    version: 1,
    units,
    calibrations: {
      version: 1,
      date: json.Calibrations.Date,
      dPlate: json.Calibrations.Dplate,
      channels:
        json.Calibrations.Channels.map((channel: any): JSONChannel => {
          return {
            version: 1,
            name: channel.Name,
            position: channel.Position,
            gain: channel.Gain,
            acquisition: channel.ChannelAcqu,
            type: channel.Type,
          }
        }) || [],
      sensors:
        json.Calibrations.Sensors.map((sensor: any): JSONSensor => {
          return {
            version: 1,
            name: sensor.Name,
            gain: sensor.Gain,
            type: sensor.Type,
          }
        }) || [],
    },
  }
}

export const convertPRJZToHeavydynUnits = (json: any): JSONHeavydynUnits => {
  return {
    deflection: {
      version: 1,
      unit: ((): PossibleHeavydynDeflectionUnits => {
        switch (
          (json.ExportedData.Drops as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Deflection'
          )?.Unit
        ) {
          case 'mm':
            return 'mm'
          case 'um':
            return 'um'
          default:
            return '1/100 mm'
        }
      })(),
      precision: 0,
    },
    force: {
      version: 1,
      unit: ((): PossibleHeavydynForceUnits => {
        switch (
          (json.ExportedData.Drops as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Load'
          )?.Unit
        ) {
          case 'N':
            return 'N'
          default:
            return 'kN'
        }
      })(),
      precision: 0,
    },
    distance: {
      version: 1,
      unit: ((): PossibleHeavydynDistanceUnits => {
        switch (
          (json.ExportedData.Points as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Distance'
          )?.Unit
        ) {
          case 'km':
            return 'km'
          case 'mi':
            return 'mi'
          default:
            return 'm'
        }
      })(),
      precision: 0,
    },
    time: {
      version: 1,
      unit: ((): PossibleHeavydynTimeUnits => {
        switch (
          (json.ExportedData.Drops as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Time'
          )?.Unit
        ) {
          case 's':
            return 's'
          case 'us':
            return 'us'
          default:
            return 'ms'
        }
      })(),
      precision: 0,
    },
    temperature: {
      version: 1,
      unit: ((): PossibleHeavydynTemperatureUnits => {
        switch (
          (json.ExportedData.Points as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Temperature'
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
      })(),
      precision: 0,
    },
  }
}
