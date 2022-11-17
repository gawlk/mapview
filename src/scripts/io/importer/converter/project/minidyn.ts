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
      name: json.ParamsBearing.Name,
      algoBearing: json.ParamsBearing.AlgoBearing,
      hasQuality: json.ParamsBearing.HasQuality,
      algoProcessing1: json.ParamsBearing.AlgoProcessing1,
      algoProcessing2: json.ParamsBearing.AlgoProcessing2,
      dPlate: json.ParamsBearing.DPlate,
      cPoisson: json.ParamsBearing.CPoisson,
      fForme: json.ParamsBearing.FForme,
      k: json.ParamsBearing.K,
      alpha: json.ParamsBearing.Alpha,
      // min: json.ParamsBearing.MinBearing,
      // max: json.ParamsBearing.MaxBearing,
    },
  }
}

export const convertPRJZToMinidynUnits = (json: any): JSONMinidynUnits => {
  return {
    modulus: {
      version: 1,
      currentUnit: ((): PossibleMinidynModulusUnits => {
        switch (
          (json.ExportedData.Points as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Modulus'
          )?.Unit
        ) {
          default:
            return 'MPa'
        }
      })(),
      currentPrecision: 0,
      min: json.ExportedData.Points.find((data: any) => data.Type === 'Modulus')
        ? json.ParamsBearing.MinBearing
        : 10000000,
      max: json.ExportedData.Points.find((data: any) => data.Type === 'Modulus')
        ? json.ParamsBearing.MaxBearing
        : 150000000,
    },
    stiffness: {
      version: 1,
      currentUnit: ((): PossibleMinidynStiffnessUnits => {
        switch (
          (json.ExportedData.Points as any[]).find(
            (exportedUnit) => exportedUnit.Type === 'Stiffness'
          )?.Unit
        ) {
          default:
            return 'MN / m'
        }
      })(),
      currentPrecision: 0,
      min: json.ExportedData.Points.find(
        (data: any) => data.Type === 'Stiffness'
      )
        ? json.ParamsBearing.MinBearing
        : 0,
      max: json.ExportedData.Points.find(
        (data: any) => data.Type === 'Stiffness'
      )
        ? json.ParamsBearing.MaxBearing
        : 1000,
    },
    deflection: {
      version: 1,
      currentUnit: ((): PossibleMinidynDeflectionUnits => {
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
      currentPrecision: 0,
      max: 1000,
    },
    force: {
      version: 1,
      currentUnit: ((): PossibleMinidynForceUnits => {
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
      currentPrecision: 0,
      max: 1000,
    },
    time: {
      version: 1,
      currentUnit: ((): PossibleMinidynTimeUnits => {
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
      currentPrecision: 0,
      max: 1000,
    },
    percentage: {
      version: 1,
      currentUnit: '%',
      currentPrecision: 0,
      max: 1000,
    },
  }
}
