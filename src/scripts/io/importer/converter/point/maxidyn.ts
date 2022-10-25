import { convertPRJZToBasePoint } from './base'
import { convertPRJZToMaxidynDrop } from '../drop'

export const convertPRJZToMaxidynPoint = (
  jsonPoint: any,
  index: number,
  json: any
): JSONMaxidynPoint => {
  const point: JSONMaxidynPoint = {
    version: 1,
    base: convertPRJZToBasePoint(jsonPoint, index, json),
    distinct: convertPRJZToMaxidynPointDistinct(jsonPoint),
  }

  point.base.drops.push(
    ...jsonPoint.Drops.map(
      (jsonDrop: any, index: number): JSONMaxidynDrop =>
        convertPRJZToMaxidynDrop(jsonDrop, index, json)
    )
  )

  return point
}

export const convertPRJZToMaxidynPointDistinct = (
  jsonPoint: any
): JSONMaxidynPointDistinct => {
  return {
    version: 1,
  }
}
