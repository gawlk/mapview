import { convertExportedUnitToJSONDataLabel } from '../shared'
import { convertPRJZToBaseDrop } from './base'

export const convertPRJZToMaxidynDrop = (
  jsonDrop: RecordAny,
  index: number,
  json: JSONAny,
): JSONMaxidynDrop => {
  const drop: JSONMaxidynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToMaxidynDropDistinct(jsonDrop),
  }

  return drop
}

export const convertPRJZToMaxidynDropDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jsonDrop: RecordAny,
): JSONMaxidynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToMaxidynDropChoices = (
  json: JSONAny,
): JSONDataLabel<MaxidynUnitsNames>[] =>
  json.ExportedData.Drops.map((exportedUnit: RecordAny) =>
    convertExportedUnitToJSONDataLabel(exportedUnit),
  )

export const convertPRJZToMaxidynDropIndexes = (
  json: JSONAny,
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
