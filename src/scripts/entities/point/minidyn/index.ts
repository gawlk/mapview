import { createBasePoint } from '../base'

export const createMinidynPoint = (data: unknown, map: mapboxgl.Map) => {
  const basePoint = createBasePoint(data, map)

  const point: MinidynPoint = {
    kind: 'minidyn' as const,
    ...basePoint,
  }

  return point
}
