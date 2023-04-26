/* eslint-disable no-fallthrough */
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
    data: shallowReactive(
      json.data.map((jsonDataValue) =>
        createDataValueFromJSON(
          jsonDataValue,
          parameters.dropGroup.choices.list
        )
      )
    ),
    point: parameters.point,
    impactData: null,
    toBaseJSON() {
      return {
        version: json.version,
        data: this.data
          .filter((data) =>
            this.point.zone.report.dataLabels.groups.list[0].saveableChoices.includes(
              data.label
            )
          )
          .map((data) => data.toJSON()),
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
  }

  return json
}

export const createBaseDropIndexFromJSON = (
  json: JSONBaseDropIndexVAny
): BaseDropIndex => {
  json = upgradeJSONDropIndex(json)

  return {
    displayedIndex: json.displayedIndex,
    toBaseJSON(): JSONBaseDropIndex {
      return {
        version: json.version,
        displayedIndex: json.displayedIndex,
      }
    },
  }
}

const upgradeJSONDropIndex = (
  json: JSONBaseDropIndexVAny
  // disable until other version is manage
  // eslint-disable-next-line sonarjs/no-identical-functions
): JSONBaseDropIndex => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
