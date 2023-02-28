import { createDataValueFromJSON } from '/src/scripts'

export const createBaseDropFromJSON = <
  Point extends MachinePoint,
  DropIndex extends MachineDropIndex,
  DropGroup extends MachineDropDataLabelsGroup
>(
  json: JSONBaseDropVAny,
  parameters: {
    point: Point
    index: DropIndex
    dropGroup: DropGroup
  }
) => {
  json = upgradeJSONDrop(json)

  const drop: BaseDrop<DropIndex, Point> = {
    index: parameters.index,
    data: createMutable(
      json.data.map((jsonDataValue) =>
        createDataValueFromJSON(
          jsonDataValue,
          parameters.dropGroup.choices.list
        )
      )
    ),
    point: parameters.point,
    impactData: null,
    toBaseJSON: function () {
      return {
        version: json.version,
        data: this.data.map((data) => data.toJSON()),
        index: json.index,
      }
    },
  }

  return drop
}

const upgradeJSONDrop = (json: JSONBaseDropVAny): JSONBaseDrop => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBaseDrop
  }

  return json
}

export const createBaseDropIndexFromJSON = (
  json: JSONBaseDropIndexVAny
): BaseDropIndex => {
  json = upgradeJSONDropIndex(json)

  return {
    displayedIndex: json.displayedIndex,
    toBaseJSON: function (): JSONBaseDropIndex {
      return {
        version: json.version,
        displayedIndex: json.displayedIndex,
      }
    },
  }
}

const upgradeJSONDropIndex = (
  json: JSONBaseDropIndexVAny
): JSONBaseDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBaseDropIndex
  }

  return json
}
