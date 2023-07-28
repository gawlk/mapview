import { convertPRJZToBasePoint } from './base'

import { convertPRJZToMinidynDrop } from '../drop'

export const convertPRJZToMinidynPoint = (
  jsonPoint: RecordAny,
  index: number,
  json: JSONAny
): JSONMinidynPoint => {
  const point: JSONMinidynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToMinidynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      (jsonDrop: RecordAny, dropIndex: number): JSONMinidynDrop =>
        convertPRJZToMinidynDrop(jsonDrop, dropIndex, json)
    )
  )

  return point
}

export const convertPRJZToMinidynPointDistinct = (
  jsonPoint: RecordAny
): JSONMinidynPointDistinct => {
  return {
    version: 1,
  }
}
