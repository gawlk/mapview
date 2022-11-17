import { convertPRJZToBasePoint } from './base'

import { convertPRJZToMinidynDrop } from '../drop'

export const convertPRJZToMinidynPoint = (
  jsonPoint: any,
  index: number,
  json: any
): JSONMinidynPoint => {
  const point: JSONMinidynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToMinidynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      (jsonDrop: any, index: number): JSONMinidynDrop =>
        convertPRJZToMinidynDrop(jsonDrop, index, json)
    )
  )

  return point
}

export const convertPRJZToMinidynPointDistinct = (
  jsonPoint: any
): JSONMinidynPointDistinct => {
  return {
    version: 1,
  }
}
