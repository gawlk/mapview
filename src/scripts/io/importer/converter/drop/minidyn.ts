import { convertPRJZToBaseDrop } from './base'

import { convertExportedUnitToJSONDataLabel } from '../shared'

export const convertPRJZToMinidynDrop = (
  jsonDrop: RecordAny,
  index: number,
  json: JSONAny,
): JSONMinidynDrop => {
  const drop: JSONMinidynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToMinidynDropDistinct(jsonDrop),
  }

  return drop
}

export const convertPRJZToMinidynDropDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jsonDrop: RecordAny,
): JSONMinidynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToMinidynDropChoices = (
  json: JSONAny,
): JSONDataLabel<MinidynUnitsNames>[] =>
  json.ExportedData.Drops.map((exportedUnit: RecordAny) =>
    convertExportedUnitToJSONDataLabel(exportedUnit),
  )

export const convertPRJZToMinidynDropIndexes = (
  json: JSONAny,
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
