import { convertPRJZToBasePoint } from './base'

import { convertPRJZToHeavydynDrop } from '../drop'

export const convertPRJZToHeavydynPoint = (
  jsonPoint: RecordAny,
  index: number,
  json: JSONAny,
): JSONHeavydynPoint => {
  const point: JSONHeavydynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToHeavydynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      (jsonDrop: RecordAny, dropIndex: number): JSONHeavydynDrop =>
        convertPRJZToHeavydynDrop(jsonDrop, dropIndex, json),
    ),
  )

  return point
}

export const convertPRJZToHeavydynPointDistinct = (
  jsonPoint: RecordAny,
): JSONHeavydynPointDistinct => {
  return {
    version: 1,
  }
}
