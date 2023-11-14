import {
  createASS,
  createFieldFromJSON,
  createLine,
  flyToPoints,
  getIndexOfSelectedInSelectableList,
  sortPoints,
  upgradeColorNameFromV1ToV2,
} from '/src/scripts'

export const createBaseReportFromJSON = <
  Zone extends MachineZone,
  DataLabels extends BaseDataLabels,
  ThresholdsGroups extends BaseThresholdsGroups,
  Thresholds extends BaseThresholds<ThresholdsGroups>,
  Project extends BaseProject,
>(
  json: JSONBaseReport,
  map: mapboxgl.Map | null,
  parameters: {
    zones: Zone[]
    project: Project
    dataLabels: DataLabels
    platform: JSONField[]
    information: JSONField[]
    thresholdsGroups: ThresholdsGroups
  },
) => {
  json = upgradeJSON(json)

  const thresholds = createThresholdsFromJSON(
    json.thresholds,
    parameters.thresholdsGroups,
  ) as Thresholds

  const project = createASS(parameters.project)

  const settings = createSettingsFromJSON(json.settings)

  const zones = createASS(parameters.zones, {
    equals: false,
  })

  const sortedPoints = createMemo(() =>
    sortPoints(zones().flatMap((zone) => zone.points() as BasePoint[])),
  )

  const line = createLine(
    () => settings,
    () => project().settings,
    sortedPoints,
    map,
  )

  const report: BaseReport<Project, Zone, DataLabels, Thresholds> = {
    kind: 'Report',
    name: createFieldFromJSON({
      version: 1,
      label: 'Name',
      value: json.name,
      settings: {
        version: 1,
      },
    }),
    settings,
    screenshots: createASS([], {
      equals: false,
    }),
    dataLabels: parameters.dataLabels,
    thresholds,
    sortedPoints,
    zones,
    line,
    platform: parameters.platform.map((field: JSONField) =>
      createFieldFromJSON(field),
    ),
    information: parameters.information.map((field: JSONField) =>
      createFieldFromJSON(field),
    ),
    project,
    fitOnMap() {
      flyToPoints(map, this.sortedPoints())
    },
    exportablePoints: createMemo(() =>
      sortedPoints().filter((point) => point.settings.isVisible()),
    ),
    toBaseJSON(): JSONBaseReport {
      return {
        version: 1,
        name: this.name.value() as string,
        dataLabels: this.dataLabels.toBaseJSON(),
        thresholds: {
          version: 1,
          colors: {
            version: 2,
            high: this.thresholds.colors.high(),
            middle: this.thresholds.colors.middle(),
            low: this.thresholds.colors.low(),
          },
          inputs: {
            version: 1,
            isRequiredARange: this.thresholds.inputs.isRequiredARange(),
            isOptionalARange: this.thresholds.inputs.isOptionalARange(),
          },
        },
        zones: this.zones().map((zone) => zone.toJSON()),
        settings: {
          version: 1,
          colorization: this.settings.colorization(),
          groupBy: this.settings.groupBy(),
          iconName: this.settings.iconName(),
          isVisible: this.settings.isVisible(),
        },
        screenshots: [],
        platform: this.platform.map((field) => field.toJSON()),
        information: this.information.map((field) => field.toJSON()),
      }
    },
  }

  return report
}

const upgradeJSON = (json: JSONBaseReportVAny): JSONBaseReport => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

const createSettingsFromJSON = ({
  colorization,
  groupBy,
  iconName,
  isVisible,
}: JSONReportSettings): BaseReportSettings => ({
  colorization: createASS(colorization),
  groupBy: createASS(groupBy),
  iconName: createASS(iconName === 'HexagonAlt' ? 'Hexagon' : iconName),
  isVisible: createASS(isVisible),
})

const createThresholdsFromJSON = (
  json: JSONBaseThresholdsSettings,
  thresholdsGroups: BaseThresholdsGroups,
): BaseThresholds<BaseThresholdsGroups> => {
  const jsonColors = upgradeThresholdsColorsJSON(json.colors)

  return {
    groups: thresholdsGroups,
    colors: {
      high: createASS(jsonColors.high),
      middle: createASS(jsonColors.middle),
      low: createASS(jsonColors.low),
    },
    inputs: {
      isRequiredARange: createASS(json.inputs.isRequiredARange),
      isOptionalARange: createASS(json.inputs.isOptionalARange),
    },
  }
}
const upgradeThresholdsColorsJSON = (
  json: JSONThresholdColorsVAny,
): JSONThresholdColors => {
  switch (json.version) {
    case 1:
      json = {
        ...json,
        version: 2,
        high: upgradeColorNameFromV1ToV2(json.high),
        middle: upgradeColorNameFromV1ToV2(json.middle),
        low: upgradeColorNameFromV1ToV2(json.low),
      }
  }

  return json
}

export const convertThresholdsConfigurationToJSON = (
  group: ThresholdsGroup<string>,
): JSONDistinctThresholdsConfiguration => {
  const customThresholdIndex: CustomThresholdIndex = 0

  return {
    version: 1,
    selectedIndex: getIndexOfSelectedInSelectableList(group.choices) || 0,
    custom: (
      group.choices.list().slice()[
        customThresholdIndex
      ] as ThresoldsList[CustomThresholdIndex]
    ).toJSON(),
  }
}
