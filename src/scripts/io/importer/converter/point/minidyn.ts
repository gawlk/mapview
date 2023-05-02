import { convertPRJZToBasePoint } from './base'

import { convertPRJZToMinidynDrop } from '../drop'

export const convertPRJZToMinidynPoint = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPoint: any,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
): JSONMinidynPoint => {
  const point: JSONMinidynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToMinidynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jsonDrop: any, dropIndex: number): JSONMinidynDrop =>
        convertPRJZToMinidynDrop(jsonDrop, dropIndex, json)
    )
  )

  return point
}

export const convertPRJZToMinidynPointDistinct = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonPoint: any
): JSONMinidynPointDistinct => {
  return {
    version: 1,
  }
}
