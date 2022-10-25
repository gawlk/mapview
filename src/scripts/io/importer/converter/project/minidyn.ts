import { convertPRJZToMinidynReport } from '../report'

export const convertPRJZToMinidynProject = (
  json: any,
  baseProject: JSONBaseProject
): JSONMinidynProject => {
  const project: JSONMinidynProject = {
    version: 1,
    base: baseProject,
    distinct: convertPRJZToMinidynProjectDistinct(json),
  }

  project.base.reports.list.push(
    ...json.PVs.map((jsonPV: any, index: number) =>
      convertPRJZToMinidynReport(jsonPV, index, json)
    )
  )

  return project
}

export const convertPRJZToMinidynProjectDistinct = (
  json: any
): JSONMinidynProjectDistinct => {
  const units = convertPRJZToMinidynUnits(json)

  return {
    version: 1,
    units,
    bearingParameters: {
      version: 1,
      min: json.ParamsBearing.MinBearing,
      max: json.ParamsBearing.MaxBearing,
    },
  }
}

export const convertPRJZToMinidynUnits = (json: any): JSONMinidynUnits => {
  return {
    modulus: {
      version: 1,
      unit: ((): PossibleMinidynModulusUnits => {
        switch (
          (json.ExportedData.Points as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Modulus'
          )?.Unit
        ) {
          default:
            return 'MPa'
        }
      })(),
      precision: 0,
    },
    stiffness: {
      version: 1,
      unit: ((): PossibleMinidynStiffnessUnits => {
        switch (
          (json.ExportedData.Points as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Stiffness'
          )?.Unit
        ) {
          default:
            return 'MN / m'
        }
      })(),
      precision: 0,
    },
    deflection: {
      version: 1,
      unit: ((): PossibleMinidynDeflectionUnits => {
        switch (
          (json.ExportedData.Drops as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Deflection'
          )?.Unit
        ) {
          case 'mm':
            return 'mm'
          default:
            return 'um'
        }
      })(),
      precision: 0,
    },
    force: {
      version: 1,
      unit: ((): PossibleMinidynForceUnits => {
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
    temperature: {
      version: 1,
      unit: ((): PossibleMinidynTemperatureUnits => {
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
    time: {
      version: 1,
      unit: ((): PossibleMinidynTimeUnits => {
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
    percentage: {
      version: 1,
      unit: '%',
      precision: 0,
    },
  }
}
