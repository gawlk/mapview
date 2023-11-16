import {
  createASS,
  createFieldFromJSON,
  createSL,
  flyToPoints,
  mapStyles,
} from '/src/scripts'
import { store } from '/src/store'

export const createBaseProjectFromJSON = <
  Report extends MachineReport,
  MathUnits extends MachineMathUnits,
>(
  json: JSONBaseProjectVAny,
  map: mapboxgl.Map | null,
  parameters: {
    reports: Report[]
    information: JSONField[]
    hardware: JSONField[]
    units: MathUnits
  },
): BaseProject<Report, MathUnits> => {
  json = upgradeJSON(json)

  const settings: BaseProjectSettings = createSettingsFromJSON(json.settings)

  const project: BaseProject<Report, MathUnits> = {
    kind: 'Project',
    name: createFieldFromJSON({
      version: 1,
      label: 'Name',
      value: json.name,
      settings: {
        version: 1,
      },
    }),
    state: createASS('Loading'),
    reports: createSL(parameters.reports),
    overlays: createASS([], {
      equals: false,
    }),
    units: parameters.units,
    settings,
    information: parameters.information.map((field: JSONField) =>
      createFieldFromJSON(field),
    ),
    hardware: parameters.hardware.map((field: JSONField) =>
      createFieldFromJSON(field),
    ),
    acquisitionParameters: createAcquisitionParametersFromJSON(
      json.acquisitionParameters,
    ),
    refreshLinesAndOverlays() {
      if (this.settings.arePointsLinked()) {
        this.reports.list().forEach((report) => {
          report.line.refresh()
        })
      }

      this.overlays().forEach((overlay) => {
        overlay.refresh()
      })
    },
    setMapStyle(styleIndex: number) {
      const oldMapStyle = map?.getStyle().sprite?.split('/').pop()
      const newMapStyle = mapStyles[styleIndex].split('/').pop()

      if (oldMapStyle !== newMapStyle) {
        map?.setStyle(mapStyles[styleIndex])
      }
    },
    fitOnMap() {
      const points = this.reports
        .list()
        .map((report) => report.zones().map((zone) => zone.points()))
        .flat(2)

      flyToPoints(map, points)
    },
    addToMap() {
      if (this.settings.map.coordinates()) {
        map?.flyTo({
          center: this.settings.map.coordinates(),
          zoom: this.settings.map.zoom(),
          pitch: this.settings.map.pitch() || 0,
          bearing: this.settings.map.rotation() || 0,
        })
      } else {
        this.reports.selected()?.fitOnMap()
      }
    },
    removeFromMap() {
      this.overlays().forEach((overlay) => overlay.removeFromMap())
    },
    toBaseJSON(): JSONBaseProject {
      return {
        version: json.version,
        name: this.name.value() as string,
        settings: this.settings.toJSON(),
        acquisitionParameters: this.acquisitionParameters.toJSON(),
        overlays: this.overlays().map((overlay) => overlay.toJSON()),
        information: this.information.map((field) => field.toJSON()),
        hardware: this.hardware.map((field) => field.toJSON()),
        reports: this.reports.toJSON((report) => report.toJSON()),
      }
    },
  }

  createEffect(
    () =>
      store.selectedProject()?.name.toString() === project.name.toString() &&
      project.setMapStyle(project.settings.map.styleIndex()),
  )

  return project
}

const upgradeJSON = (json: JSONBaseProjectVAny): JSONBaseProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

const createSettingsFromJSON = (
  settings: JSONProjectSettings,
): BaseProjectSettings => ({
  areOverlaysVisible: createASS(settings.areOverlaysVisible),
  arePointsLinked: createASS(settings.arePointsLinked),
  arePointsVisible: createASS(settings.arePointsVisible),
  pointsState: createASS(settings.pointsState),
  map: createMapSettingsFromJSON(settings.map),
  arePointsLocked: createASS(true),
  toJSON() {
    return {
      version: 1,
      areOverlaysVisible: this.areOverlaysVisible(),
      arePointsLinked: this.arePointsLinked(),
      arePointsVisible: this.arePointsVisible(),
      pointsState: this.pointsState(),
      map: {
        version: 1,
        styleIndex: this.map.styleIndex(),
        pitch: this.map.pitch(),
        rotation: this.map.rotation(),
        zoom: this.map.zoom(),
        coordinates: this.map.coordinates() || undefined,
      },
    }
  },
})

const createMapSettingsFromJSON = (
  settings: JSONProjectMapSettings,
): BaseProjectMapSettings => ({
  styleIndex: createASS(settings.styleIndex),
  coordinates: createASS(settings.coordinates),
  pitch: createASS(settings.pitch),
  rotation: createASS(settings.rotation),
  zoom: createASS(settings.zoom),
  toJSON() {
    return {
      version: 1,
      styleIndex: this.styleIndex(),
      pitch: this.pitch(),
      rotation: this.rotation(),
      zoom: this.zoom(),
      coordinates: this.coordinates() || undefined,
    }
  },
})

const createAcquisitionParametersFromJSON = (
  parameters: JSONAcquisitionParameters,
): BaseAcquisitionParameters => ({
  frequency: createASS(parameters.frequency),
  nbSamples: createASS(parameters.nbSamples),
  preTrig: createASS(parameters.preTrig),
  smoothing: createASS(parameters.smoothing),
  toJSON() {
    return {
      version: 1,
      frequency: this.frequency(),
      nbSamples: this.nbSamples(),
      preTrig: this.preTrig(),
      smoothing: this.smoothing(),
    }
  },
})
