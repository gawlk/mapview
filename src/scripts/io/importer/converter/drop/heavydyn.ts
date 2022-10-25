import { convertPRJZToBaseDrop } from './base'
import {
  convertExportedUnitToJSONDataLabel,
  convertSensorPositionToName,
} from '../shared'

export const convertPRJZToHeavydynDrop = (
  jsonDrop: any,
  index: number,
  json: any
): JSONHeavydynDrop => {
  const drop: JSONHeavydynDrop = {
    version: 1,
    base: convertPRJZToBaseDrop(jsonDrop, index, json),
    distinct: convertPRJZToHeavydynDropDistinct(jsonDrop),
  }

  return drop
}

export const convertPRJZToHeavydynDropDistinct = (
  jsonDrop: any
): JSONHeavydynDropDistinct => {
  return {
    version: 1,
  }
}

export const convertPRJZToHeavydynDropChoices = (
  json: any
): JSONDataLabel<HeavydynUnitsNames>[] => [
  ...json.ExportedData.Drops.map((exportedUnit: any) =>
    convertExportedUnitToJSONDataLabel(exportedUnit)
  ).filter((choice: JSONDataLabel<string>) => choice.name !== 'Deflections'),
  ...json.Calibrations.SensorsPosition.map(
    (position: number): JSONDataLabel<string> => {
      return {
        version: 1,
        name: convertSensorPositionToName(position),
        unit: 'deflection',
      }
    }
  ),
]

export const convertPRJZToHeavydynDropIndexes = (
  json: any
): JSONHeavydynDropIndex[] => {
  return json.Sequences.Steps.map((step: any): JSONHeavydynDropIndex => {
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
