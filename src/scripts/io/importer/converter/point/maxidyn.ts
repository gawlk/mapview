import { convertPRJZToBasePoint } from './base'

import { convertPRJZToMaxidynDrop } from '../drop'

export const convertPRJZToMaxidynPoint = (
  jsonPoint: RecordAny,
  index: number,
  json: JSONAny
): JSONMaxidynPoint => {
  const point: JSONMaxidynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToMaxidynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      (jsonDrop: RecordAny, dropIndex: number): JSONMaxidynDrop =>
        convertPRJZToMaxidynDrop(jsonDrop, dropIndex, json)
    )
  )

  return point
}

export const convertPRJZToMaxidynPointDistinct = (
  jsonPoint: RecordAny
): JSONMaxidynPointDistinct => {
  return {
    version: 1,
  }
}
