import { convertPRJZToBaseDrop } from './base'

import { convertExportedUnitToJSONDataLabel } from '../shared'

export const convertPRJZToMinidynDrop = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonDrop: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonDrop: any
): JSONMinidynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToMinidynDropChoices = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONDataLabel<MinidynUnitsNames>[] =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json.ExportedData.Drops.map((exportedUnit: any) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  )

export const convertPRJZToMinidynDropIndexes = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
