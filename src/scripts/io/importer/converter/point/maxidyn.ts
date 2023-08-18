import { convertPRJZToMaxidynDrop } from '../drop'
import { convertPRJZToBasePoint } from './base'

export const convertPRJZToMaxidynPoint = (
  jsonPoint: RecordAny,
  index: number,
  json: JSONAny,
): JSONMaxidynPoint => {
  const point: JSONMaxidynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToMaxidynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      (jsonDrop: RecordAny, dropIndex: number): JSONMaxidynDrop =>
        convertPRJZToMaxidynDrop(jsonDrop, dropIndex, json),
    ),
  )

  return point
}

export const convertPRJZToMaxidynPointDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jsonPoint: RecordAny,
): JSONMaxidynPointDistinct => {
  return {
    version: 1,
  }
}
