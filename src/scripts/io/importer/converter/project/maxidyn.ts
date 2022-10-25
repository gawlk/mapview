import { convertPRJZToMaxidynReport } from '../report'

export const convertPRJZToMaxidynProject = (
  json: any,
  baseProject: JSONBaseProject
): JSONMaxidynProject => {
  const project: JSONMaxidynProject = {
    version: 1,
    base: baseProject,
    distinct: convertPRJZToMaxidynProjectDistinct(json),
  }

  project.base.reports.list.push(
    ...json.PVs.map(
      (jsonPV: any, index: number): JSONMaxidynReport =>
        convertPRJZToMaxidynReport(jsonPV, index, json)
    )
  )
  project.base.reports.selected = project.base.reports.list.length ? 0 : null

  return project
}

export const convertPRJZToMaxidynProjectDistinct = (
  json: any
): JSONMaxidynProjectDistinct => {
  const units = convertPRJZToMaxidynUnits(json)

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

export const convertPRJZToMaxidynUnits = (json: any): JSONMaxidynUnits => {
  return {
    modulus: {
      version: 1,
      unit: ((): PossibleMaxidynModulusUnits => {
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
      unit: ((): PossibleMaxidynStiffnessUnits => {
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
      unit: ((): PossibleMaxidynDeflectionUnits => {
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
      unit: ((): PossibleMaxidynForceUnits => {
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
      unit: ((): PossibleMaxidynDistanceUnits => {
        switch (
          (json.ExportedData.Points as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Distance'
          )?.Unit
        ) {
          case 'mi':
            return 'mi'
          case 'km':
            return 'km'
          default:
            return 'm'
        }
      })(),
      precision: 0,
    },
    time: {
      version: 1,
      unit: ((): PossibleMaxidynTimeUnits => {
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
