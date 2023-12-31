import { run } from '/src/scripts'

import { convertPRJZToMinidynReport } from '../report'

export const convertPRJZToMinidynProject = (
  json: JSONAny,
  baseProject: JSONBaseProject,
): JSONMinidynProject => {
  const project: JSONMinidynProject = {
    version: 1,
    machine: 'Minidyn',
    base: baseProject,
    distinct: convertPRJZToMinidynProjectDistinct(json),
  }

  project.base.reports.list.push(
    ...json.PVs.map((jsonPV: RecordAny, index: number) =>
      convertPRJZToMinidynReport(jsonPV, index, json),
    ),
  )

  project.base.reports.selectedIndex = project.base.reports.list.length
    ? 0
    : null

  return project
}

export const convertPRJZToMinidynProjectDistinct = (
  json: JSONAny,
): JSONMinidynProjectDistinct => {
  const units = convertPRJZToMinidynUnits(json)

  return {
    version: 1,
    units,
    bearingParameters: {
      version: 1,
      name: String(json.ParamsBearing.Name),
      algoBearing: json.ParamsBearing.AlgoBearing,
      hasQuality: json.ParamsBearing.HasQuality,
      algoProcessing1: json.ParamsBearing.AlgoProcessing1,
      algoProcessing2: json.ParamsBearing.AlgoProcessing2,
      dPlate: json.ParamsBearing.DPlate,
      cPoisson: json.ParamsBearing.CPoisson,
      fForme: json.ParamsBearing.FForme,
      k: json.ParamsBearing.K,
      alpha: json.ParamsBearing.Alpha,
    },
  }
}

export const convertPRJZToMinidynUnits = (json: JSONAny): JSONMinidynUnits => {
  const exportedModulus = json.ExportedData.Points.find(
    (exportedUnit: RecordAny) => exportedUnit.Type === 'Modulus',
  )

  const exportedStiffness = json.ExportedData.Points.find(
    (exportedUnit: RecordAny) => exportedUnit.Type === 'Stiffness',
  )

  return {
    version: 1,
    modulus: {
      version: 1,
      currentUnit: 'MPa',
      currentPrecision: 0,
      min: exportedModulus ? Number(json.ParamsBearing.MinBearing) : 10000000,
      max: exportedModulus ? Number(json.ParamsBearing.MaxBearing) : 150000000,
    },
    stiffness: {
      version: 1,
      currentUnit: 'MN / m',
      currentPrecision: 0,
      min: exportedStiffness ? Number(json.ParamsBearing.MinBearing) : 0,
      max: exportedStiffness ? Number(json.ParamsBearing.MaxBearing) : 1000,
    },
    deflection: {
      version: 1,
      currentUnit: run((): PossibleMinidynDeflectionUnits => {
        switch (
          (json.ExportedData.Drops as RecordAny[]).find(
            (exportedUnit) => exportedUnit.Type === 'Deflection',
          )?.Unit
        ) {
          case 'mm':
            return 'mm'
          default:
            return 'um'
        }
      }),
      currentPrecision: 0,
      max: 1000,
    },
    distance: {
      version: 1,
      currentUnit: ((): PossibleMinidynDistanceUnits => {
        switch (
          (json.ExportedData.Points as RecordAny[]).find(
            (exportedUnit) => exportedUnit.Type === 'Distance',
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
      currentPrecision: 0,
      max: 1000,
    },
    force: {
      version: 1,
      currentUnit: run((): PossibleMinidynForceUnits => {
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
      max: 1000,
    },
    time: {
      version: 1,
      currentUnit: run((): PossibleMinidynTimeUnits => {
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
      max: 1000,
    },
    percentage: {
      version: 1,
      currentUnit: '%',
      currentPrecision: 0,
      max: 100,
    },
  }
}
