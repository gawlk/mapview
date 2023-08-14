import { convertPRJZToBaseDrop } from './base'

import {
  convertExportedUnitToJSONDataLabel,
  convertSensorPositionToName,
} from '../shared'

export const convertPRJZToHeavydynDrop = (
  jsonDrop: RecordAny,
  index: number,
  json: JSONAny,
): JSONHeavydynDrop => {
  const drop: JSONHeavydynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToHeavydynDropDistinct(jsonDrop),
  }

  return drop
}

export const convertPRJZToHeavydynDropDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jsonDrop: RecordAny,
): JSONHeavydynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToHeavydynDropChoices = (
  json: JSONAny,
): JSONDataLabel<HeavydynUnitsNames>[] => [
  ...json.ExportedData.Drops.map((exportedUnit: RecordAny) =>
    convertExportedUnitToJSONDataLabel(exportedUnit),
  ).filter((choice: JSONDataLabel<string>) => choice.name !== 'Deflections'),
  ...json.Calibrations.SensorsPosition.map(
    (position: number): JSONDataLabel<string> => {
      return {
        version: 1,
        name: convertSensorPositionToName(position),
        unit: 'deflection',
      }
    },
  ),
]

export const convertPRJZToHeavydynDropIndexes = (
  json: JSONAny,
): JSONHeavydynDropIndex[] => {
  return json.Sequences.Steps.map((step: RecordAny): JSONHeavydynDropIndex => {
    return {
      version: 1,
      base: {
        version: 1,
        displayedIndex: step.NumStep,
      },
      distinct: {
        version: 1,
        type: step.TypeDrop as HeavydynDropType,
        value: step.ValueDrop,
        unit: step.TypeDrop,
      },
    }
  })
}
