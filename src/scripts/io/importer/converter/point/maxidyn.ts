import { convertPRJZToBasePoint } from './base'

import { convertPRJZToMaxidynDrop } from '../drop'

export const convertPRJZToMaxidynPoint = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPoint: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONMaxidynPoint => {
  const point: JSONMaxidynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToMaxidynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jsonDrop: any, dropIndex: number): JSONMaxidynDrop =>
        convertPRJZToMaxidynDrop(jsonDrop, dropIndex, json)
    )
  )

  return point
}

export const convertPRJZToMaxidynPointDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPoint: any
): JSONMaxidynPointDistinct => {
  return {
    version: 1,
  }
}
