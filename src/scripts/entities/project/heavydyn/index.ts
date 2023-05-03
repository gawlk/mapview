/* eslint-disable no-console */
import {
  createHeavydynMathUnitsFromJSON,
  createHeavydynReportFromJSON,
  createWatcherHandler,
} from '/src/scripts'

import { createHeavydynProjectCorrectionParametersFromJSON } from './correctionParameters'

import { createBaseProjectFromJSON } from '../base'

export const createHeavydynProjectFromJSON = (
  json: JSONHeavydynProjectVAny,
  map: mapboxgl.Map | null
) => {
  json = upgradeJSON(json)

  const watcherHandler = createWatcherHandler()

  const units: HeavydynMathUnits = createHeavydynMathUnitsFromJSON(
    json.distinct.units
  )

  const baseProject = createBaseProjectFromJSON(json.base, map, {
    reports: [] as HeavydynReport[],
    information: json.base.information,
    hardware: json.base.hardware,
    units,
  })

  const project = shallowReactive({
    ...baseProject,
    machine: 'Heavydyn',
    calibrations: {
      date: new Date(json.distinct.calibrations.date),
      dPlate: json.distinct.calibrations.dPlate,
      channels: json.distinct.calibrations.channels,
      sensors: json.distinct.calibrations.sensors,
    },
    correctionParameters: createHeavydynProjectCorrectionParametersFromJSON(
      json.distinct.correctionParameters,
      units
    ),
    remove() {
      baseProject.remove.call(project)

      watcherHandler.clean()
    },
    toJSON() {
      return {
        version: json.version,
        machine: 'Heavydyn',
        base: this.toBaseJSON(),
        distinct: {
          version: json.distinct.version,
          calibrations: json.distinct.calibrations,
          units: {
            version: 2,
            deflection: this.units.deflection.toJSON(),
            distance: this.units.distance.toJSON(),
            force: this.units.force.toJSON(),
            temperature: this.units.temperature.toJSON(),
            time: this.units.time.toJSON(),
            modulus: this.units.modulus.toJSON(),
            cumSum: this.units.cumSum.toJSON(),
            radius: this.units.radius.toJSON(),
          },
          correctionParameters: {
            version: 1,
            load: {
              version: 2,
              active: this.correctionParameters.load.active,
              source:
                this.correctionParameters.load.source.selected || 'Sequence',
              customValue: this.correctionParameters.load.customValue.value,
            },
            temperature: {
              version: 2,
              active: this.correctionParameters.temperature.active,
              source:
                this.correctionParameters.temperature.source.selected || 'Tair',
              average:
                this.correctionParameters.temperature.average.selected ||
                'Zone',
              customValue:
                this.correctionParameters.temperature.customValue.value,
              reference: this.correctionParameters.temperature.reference.value,
              structureType:
                this.correctionParameters.temperature.structureType.getSelectedIndex() ||
                0,
            },
          },
        },
      }
    },
  } as HeavydynProject)

  project.reports.list.push(
    ...json.base.reports.list.map((report) =>
      createHeavydynReportFromJSON(report as JSONHeavydynReport, map, {
        project,
      })
    )
  )

  project.reports.selectIndex(json.base.reports.selectedIndex)

  return project
}

const upgradeJSON = (json: JSONHeavydynProjectVAny): JSONHeavydynProject => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}
