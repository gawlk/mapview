import { convertPRJZToBaseDrop } from './base'

import { convertExportedUnitToJSONDataLabel } from '../shared'

export const convertPRJZToMinidynDrop = (
  jsonDrop: any,
  index: number,
  json: any
): JSONMinidynDrop => {
  const drop: JSONMinidynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToMinidynDropDistinct(jsonDrop),
  }

  return drop
}

export const convertPRJZToMinidynDropDistinct = (
  jsonDrop: any
): JSONMinidynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToMinidynDropChoices = (
  json: any
): JSONDataLabel<MinidynUnitsNames>[] =>
  json.ExportedData.Drops.map((exportedUnit: any) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  )

export const convertPRJZToMinidynDropIndexes = (
  json: any
): JSONMinidynDropIndex[] =>
  Array(json.ParamsPoint.NbTotal)
    .fill(0)
    .map((_, index): JSONMinidynDropIndex => {
      return {
        version: 1,
        base: {
          version: 1,
          displayedIndex: index + 1,
        },
        distinct: {
          version: 1,
          type:
            index + 1 <= json.ParamsPoint.NbTraining ? 'Training' : 'Averaging',
        },
      }
    })
