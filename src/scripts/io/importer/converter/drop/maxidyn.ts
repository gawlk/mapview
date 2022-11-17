import { convertPRJZToBaseDrop } from './base'

import { convertExportedUnitToJSONDataLabel } from '../shared'

export const convertPRJZToMaxidynDrop = (
  jsonDrop: any,
  index: number,
  json: any
): JSONMaxidynDrop => {
  const drop: JSONMaxidynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToMaxidynDropDistinct(jsonDrop),
  }

  return drop
}

export const convertPRJZToMaxidynDropDistinct = (
  jsonDrop: any
): JSONMaxidynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToMaxidynDropChoices = (
  json: any
): JSONDataLabel<MaxidynUnitsNames>[] =>
  json.ExportedData.Drops.map((exportedUnit: any) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  )

export const convertPRJZToMaxidynDropIndexes = (
  json: any
): JSONMaxidynDropIndex[] =>
  Array(json.ParamsPoint.NbTotal)
    .fill(0)
    .map((_, index): JSONMaxidynDropIndex => {
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
