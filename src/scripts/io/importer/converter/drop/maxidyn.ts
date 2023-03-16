import { convertPRJZToBaseDrop } from './base'

import { convertExportedUnitToJSONDataLabel } from '../shared'

export const convertPRJZToMaxidynDrop = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonDrop: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONMaxidynDrop => {
  const drop: JSONMaxidynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToMaxidynDropDistinct(),
  }

  return drop
}

export const convertPRJZToMaxidynDropDistinct = (): JSONMaxidynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToMaxidynDropChoices = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONDataLabel<MaxidynUnitsNames>[] =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json.ExportedData.Drops.map((exportedUnit: any) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  )

export const convertPRJZToMaxidynDropIndexes = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
