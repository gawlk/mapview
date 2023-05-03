import { convertPRJZToBaseDrop } from './base'

import { convertExportedUnitToJSONDataLabel } from '../shared'

export const convertPRJZToMaxidynDrop = (
  jsonDrop: RecordAny,
  index: number,
  json: RecordAny
): JSONMaxidynDrop => {
  const drop: JSONMaxidynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToMaxidynDropDistinct(jsonDrop),
  }

  return drop
}

export const convertPRJZToMaxidynDropDistinct = (
  jsonDrop: RecordAny
): JSONMaxidynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToMaxidynDropChoices = (
  json: RecordAny
): JSONDataLabel<MaxidynUnitsNames>[] =>
  json.ExportedData.Drops.map((exportedUnit: RecordAny) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  )

export const convertPRJZToMaxidynDropIndexes = (
  json: RecordAny
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
