import { createBaseDropFromJSON, createBaseDropIndexFromJSON } from '../base'

export const createMaxidynDropFromJSON = (
  json: JSONMaxidynDropVAny,
  parameters: {
    point: MaxidynPoint
  }
) => {
  json = upgradeJSONDrop(json)

  const dropGroup = parameters.point.zone.report.dataLabels.groups.list[0]

  const index = dropGroup?.indexes?.list[json.base.index]

  const baseDrop = createBaseDropFromJSON(json.base, {
    point: parameters.point,
    index,
    dropGroup,
  })

  const drop = createMutable<MaxidynDrop>({
    ...baseDrop,
    machine: 'Maxidyn',
    toJSON() {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
        },
      }
    },
  })

  return drop
}

const upgradeJSONDrop = (json: JSONMaxidynDropVAny): JSONMaxidynDrop => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

export const createMaxidynDropIndexFromJSON = (json: JSONMaxidynDropIndex) => {
  json = upgradeJSONDropIndex(json)

  const dropIndex: MaxidynDropIndex = {
    ...createBaseDropIndexFromJSON(json.base),
    machine: 'Maxidyn',
    type: json.distinct.type,
    toJSON() {
      return {
        version: json.version,
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          type: json.distinct.type,
        },
      }
    },
  }

  return dropIndex
}

const upgradeJSONDropIndex = (
  json: JSONMaxidynDropIndexVAny
): JSONMaxidynDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
